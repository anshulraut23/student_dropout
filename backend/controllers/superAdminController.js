import dataStore from '../storage/dataStore.js';

const hasQuerySupport = () => typeof dataStore.query === 'function';

export const getPlatformStats = async (req, res) => {
  try {
    if (!hasQuerySupport()) {
      const [schools, users, students, interventions] = await Promise.all([
        dataStore.getSchools(),
        dataStore.getUsers(),
        dataStore.getStudents(),
        dataStore.getInterventions({})
      ]);

      return res.json({
        success: true,
        stats: {
          totalSchools: schools.length,
          totalTeachers: users.filter(u => u.role === 'teacher').length,
          totalStudents: students.length,
          totalHighRiskStudents: 0,
          totalActiveInterventions: interventions.filter(i => !['completed', 'cancelled'].includes((i.status || '').toLowerCase())).length
        }
      });
    }

    const statsQuery = `
      SELECT
        (SELECT COUNT(*) FROM schools) AS total_schools,
        (SELECT COUNT(*) FROM users WHERE role = 'teacher') AS total_teachers,
        (SELECT COUNT(*) FROM students WHERE status = 'active') AS total_students,
        (SELECT COUNT(DISTINCT student_id) FROM risk_predictions WHERE risk_level IN ('high', 'critical')) AS total_high_risk_students,
        (SELECT COUNT(*) FROM interventions WHERE status NOT IN ('completed', 'cancelled')) AS total_active_interventions
    `;

    const result = await dataStore.query(statsQuery, []);
    const row = result.rows[0];

    return res.json({
      success: true,
      stats: {
        totalSchools: parseInt(row.total_schools) || 0,
        totalTeachers: parseInt(row.total_teachers) || 0,
        totalStudents: parseInt(row.total_students) || 0,
        totalHighRiskStudents: parseInt(row.total_high_risk_students) || 0,
        totalActiveInterventions: parseInt(row.total_active_interventions) || 0
      }
    });
  } catch (error) {
    console.error('Super admin platform stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to load platform stats' });
  }
};

export const getAllSchoolsWithSummary = async (req, res) => {
  try {
    if (!hasQuerySupport()) {
      const [schools, users, students] = await Promise.all([
        dataStore.getSchools(),
        dataStore.getUsers(),
        dataStore.getStudents()
      ]);

      const schoolSummaries = schools.map(school => {
        const schoolStudents = students.filter(st => st.schoolId === school.id || st.school_id === school.id);
        const schoolTeachers = users.filter(u => (u.schoolId === school.id || u.school_id === school.id) && u.role === 'teacher');
        const schoolAdmins = users.filter(u => (u.schoolId === school.id || u.school_id === school.id) && u.role === 'admin');

        return {
          id: school.id,
          name: school.name,
          city: school.city,
          state: school.state,
          isActive: school.isActive ?? school.is_active ?? true,
          studentsCount: schoolStudents.length,
          teachersCount: schoolTeachers.length,
          admins: schoolAdmins.map(a => ({ id: a.id, fullName: a.fullName || a.full_name, email: a.email })),
          highRiskCount: 0,
          riskPercentage: 0,
          interventionPercentage: 0
        };
      });

      return res.json({ success: true, schools: schoolSummaries });
    }

    const query = `
      SELECT
        s.id,
        s.name,
        s.city,
        s.state,
        COALESCE(s.is_active, true) AS is_active,
        COUNT(DISTINCT st.id) AS students_count,
        COUNT(DISTINCT CASE WHEN u.role = 'teacher' THEN u.id END) AS teachers_count,
        COUNT(DISTINCT CASE WHEN rp.risk_level IN ('high', 'critical') THEN rp.student_id END) AS high_risk_count,
        COUNT(DISTINCT CASE WHEN i.status NOT IN ('completed', 'cancelled') THEN i.id END) AS active_interventions
      FROM schools s
      LEFT JOIN students st ON st.school_id = s.id AND st.status = 'active'
      LEFT JOIN users u ON u.school_id = s.id
      LEFT JOIN risk_predictions rp ON rp.school_id = s.id
      LEFT JOIN interventions i ON i.student_id = st.id
      GROUP BY s.id, s.name, s.city, s.state, s.is_active
      ORDER BY s.name ASC
    `;

    const result = await dataStore.query(query, []);

    const schools = result.rows.map(row => {
      const studentsCount = parseInt(row.students_count) || 0;
      const highRiskCount = parseInt(row.high_risk_count) || 0;
      const activeInterventions = parseInt(row.active_interventions) || 0;

      return {
        id: row.id,
        name: row.name,
        city: row.city,
        state: row.state,
        isActive: row.is_active,
        studentsCount,
        teachersCount: parseInt(row.teachers_count) || 0,
        highRiskCount,
        riskPercentage: studentsCount > 0 ? Number(((highRiskCount / studentsCount) * 100).toFixed(1)) : 0,
        interventionPercentage: studentsCount > 0 ? Number(((activeInterventions / studentsCount) * 100).toFixed(1)) : 0
      };
    });

    return res.json({ success: true, schools });
  } catch (error) {
    console.error('Super admin schools list error:', error);
    res.status(500).json({ success: false, error: 'Failed to load schools' });
  }
};

export const getAllSchoolAdmins = async (req, res) => {
  try {
    const admins = await dataStore.getUsersByRole('admin');

    const formatted = admins.map(admin => ({
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      schoolId: admin.schoolId,
      status: admin.status
    }));

    res.json({ success: true, admins: formatted });
  } catch (error) {
    console.error('Super admin get admins error:', error);
    res.status(500).json({ success: false, error: 'Failed to load school admins' });
  }
};

export const getPendingAdminRequests = async (req, res) => {
  try {
    const users = await dataStore.getUsersByRole('admin');
    const pendingAdmins = users.filter((user) => (user.status || '').toLowerCase() === 'pending');

    const requests = await Promise.all(
      pendingAdmins.map(async (user) => {
        const school = user.schoolId ? await dataStore.getSchoolById(user.schoolId) : null;
        return {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          schoolId: user.schoolId,
          schoolName: school?.name || null,
          schoolCity: school?.city || null,
          schoolState: school?.state || null,
          createdAt: user.createdAt,
          status: user.status
        };
      })
    );

    res.json({ success: true, requests });
  } catch (error) {
    console.error('Super admin pending admin requests error:', error);
    res.status(500).json({ success: false, error: 'Failed to load pending admin requests' });
  }
};

export const approveAdminRegistration = async (req, res) => {
  try {
    const { adminId } = req.params;
    const user = await dataStore.getUserById(adminId);

    if (!user || user.role !== 'admin') {
      return res.status(404).json({ success: false, error: 'Admin request not found' });
    }

    const currentStatus = (user.status || '').toLowerCase();
    if (currentStatus === 'approved') {
      return res.json({ success: true, message: 'Admin already approved' });
    }

    await dataStore.updateUser(adminId, { status: 'approved' });

    if (user.schoolId) {
      await dataStore.updateSchool(user.schoolId, { adminId: adminId });
    }

    return res.json({ success: true, message: 'Admin approved successfully' });
  } catch (error) {
    console.error('Super admin approve admin error:', error);
    res.status(500).json({ success: false, error: 'Failed to approve admin request' });
  }
};

export const rejectAdminRegistration = async (req, res) => {
  try {
    const { adminId } = req.params;
    const user = await dataStore.getUserById(adminId);

    if (!user || user.role !== 'admin') {
      return res.status(404).json({ success: false, error: 'Admin request not found' });
    }

    await dataStore.updateUser(adminId, { status: 'rejected' });

    return res.json({ success: true, message: 'Admin request rejected' });
  } catch (error) {
    console.error('Super admin reject admin error:', error);
    res.status(500).json({ success: false, error: 'Failed to reject admin request' });
  }
};

export const updateSchoolStatus = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, error: 'isActive must be a boolean' });
    }

    const school = await dataStore.getSchoolById(schoolId);
    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' });
    }

    try {
      const updated = await dataStore.updateSchool(schoolId, { isActive });
      return res.json({
        success: true,
        message: `School ${isActive ? 'activated' : 'deactivated'} successfully`,
        school: updated
      });
    } catch (columnError) {
      return res.status(500).json({
        success: false,
        error: 'School status column not available. Please run super admin migration first.'
      });
    }
  } catch (error) {
    console.error('Super admin update school status error:', error);
    res.status(500).json({ success: false, error: 'Failed to update school status' });
  }
};

export const getSchoolSummary = async (req, res) => {
  try {
    const { schoolId } = req.params;

    if (!hasQuerySupport()) {
      const [school, users, students, interventions] = await Promise.all([
        dataStore.getSchoolById(schoolId),
        dataStore.getUsersBySchool(schoolId),
        dataStore.getStudents(),
        dataStore.getInterventions({ schoolId })
      ]);

      if (!school) {
        return res.status(404).json({ success: false, error: 'School not found' });
      }

      const schoolStudents = students.filter(st => st.schoolId === schoolId || st.school_id === schoolId);
      const teachersCount = users.filter(u => u.role === 'teacher').length;

      return res.json({
        success: true,
        summary: {
          schoolId,
          schoolName: school.name,
          totalStudents: schoolStudents.length,
          totalTeachers: teachersCount,
          highRiskStudents: 0,
          activeInterventions: interventions.filter(i => !['completed', 'cancelled'].includes((i.status || '').toLowerCase())).length,
          riskPercentage: 0,
          interventionPercentage: schoolStudents.length > 0 ? Number(((interventions.length / schoolStudents.length) * 100).toFixed(1)) : 0
        }
      });
    }

    const query = `
      SELECT
        s.id AS school_id,
        s.name AS school_name,
        COUNT(DISTINCT st.id) AS total_students,
        COUNT(DISTINCT CASE WHEN u.role = 'teacher' THEN u.id END) AS total_teachers,
        COUNT(DISTINCT CASE WHEN rp.risk_level IN ('high', 'critical') THEN rp.student_id END) AS high_risk_students,
        COUNT(DISTINCT CASE WHEN i.status NOT IN ('completed', 'cancelled') THEN i.id END) AS active_interventions
      FROM schools s
      LEFT JOIN students st ON st.school_id = s.id AND st.status = 'active'
      LEFT JOIN users u ON u.school_id = s.id
      LEFT JOIN risk_predictions rp ON rp.school_id = s.id
      LEFT JOIN interventions i ON i.student_id = st.id
      WHERE s.id = $1
      GROUP BY s.id, s.name
    `;

    const result = await dataStore.query(query, [schoolId]);
    if (!result.rows.length) {
      return res.status(404).json({ success: false, error: 'School not found' });
    }

    const row = result.rows[0];
    const totalStudents = parseInt(row.total_students) || 0;
    const highRiskStudents = parseInt(row.high_risk_students) || 0;
    const activeInterventions = parseInt(row.active_interventions) || 0;

    res.json({
      success: true,
      summary: {
        schoolId: row.school_id,
        schoolName: row.school_name,
        totalStudents,
        totalTeachers: parseInt(row.total_teachers) || 0,
        highRiskStudents,
        activeInterventions,
        riskPercentage: totalStudents > 0 ? Number(((highRiskStudents / totalStudents) * 100).toFixed(1)) : 0,
        interventionPercentage: totalStudents > 0 ? Number(((activeInterventions / totalStudents) * 100).toFixed(1)) : 0
      }
    });
  } catch (error) {
    console.error('Super admin school summary error:', error);
    res.status(500).json({ success: false, error: 'Failed to load school summary' });
  }
};

export const getSchoolUpdates = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const school = await dataStore.getSchoolById(schoolId);
    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' });
    }

    if (!hasQuerySupport()) {
      const [users, requests, interventions] = await Promise.all([
        dataStore.getUsersBySchool(schoolId),
        dataStore.getRequestsBySchool(schoolId),
        dataStore.getInterventions({ schoolId })
      ]);

      const adminEvents = users
        .filter((user) => user.role === 'admin')
        .map((user) => ({
          id: `admin-${user.id}`,
          type: 'admin_registration',
          title: 'Admin registration request',
          status: user.status || 'pending',
          actorName: user.fullName || user.full_name || user.email,
          time: user.createdAt || user.created_at || null
        }));

      const teacherRequestEvents = requests.map((request) => {
        const teacher = users.find((user) => user.id === request.teacherId || user.id === request.teacher_id);
        return {
          id: `request-${request.id}`,
          type: 'teacher_request',
          title: 'Teacher approval request',
          status: request.status || 'pending',
          actorName: teacher?.fullName || teacher?.full_name || teacher?.email || 'Teacher',
          time: request.processedAt || request.processed_at || request.createdAt || request.created_at || null
        };
      });

      const interventionEvents = interventions.map((intervention) => ({
        id: `intervention-${intervention.id}`,
        type: 'intervention',
        title: 'Intervention update',
        status: intervention.status || 'planned',
        actorName: intervention.studentName || intervention.student_name || 'Student',
        time: intervention.createdAt || intervention.created_at || intervention.updatedAt || intervention.updated_at || null
      }));

      const updates = [...adminEvents, ...teacherRequestEvents, ...interventionEvents]
        .sort((left, right) => new Date(right.time || 0).getTime() - new Date(left.time || 0).getTime())
        .slice(0, 20);

      return res.json({
        success: true,
        school: { id: school.id, name: school.name },
        updates
      });
    }

    const updatesQuery = `
      SELECT * FROM (
        SELECT
          CONCAT('admin-', u.id) AS id,
          'admin_registration' AS type,
          'Admin registration request' AS title,
          COALESCE(u.status, 'pending') AS status,
          COALESCE(u.full_name, u.email) AS actor_name,
          u.created_at AS event_time
        FROM users u
        WHERE u.school_id = $1 AND u.role = 'admin'

        UNION ALL

        SELECT
          CONCAT('request-', r.id) AS id,
          'teacher_request' AS type,
          'Teacher approval request' AS title,
          COALESCE(r.status, 'pending') AS status,
          COALESCE(t.full_name, t.email, 'Teacher') AS actor_name,
          COALESCE(r.processed_at, r.created_at) AS event_time
        FROM requests r
        LEFT JOIN users t ON t.id = r.teacher_id
        WHERE r.school_id = $1

        UNION ALL

        SELECT
          CONCAT('intervention-', i.id) AS id,
          'intervention' AS type,
          'Intervention update' AS title,
          COALESCE(i.status, 'planned') AS status,
          COALESCE(st.name, 'Student') AS actor_name,
          i.created_at AS event_time
        FROM interventions i
        JOIN students st ON st.id = i.student_id
        WHERE st.school_id = $1
      ) updates
      ORDER BY event_time DESC NULLS LAST
      LIMIT 20
    `;

    const updatesResult = await dataStore.query(updatesQuery, [schoolId]);

    const updates = updatesResult.rows.map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      status: row.status,
      actorName: row.actor_name,
      time: row.event_time
    }));

    return res.json({
      success: true,
      school: { id: school.id, name: school.name },
      updates
    });
  } catch (error) {
    console.error('Super admin school updates error:', error);
    res.status(500).json({ success: false, error: 'Failed to load school updates' });
  }
};

export const getSchoolHighRiskStudents = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const school = await dataStore.getSchoolById(schoolId);
    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' });
    }

    if (!hasQuerySupport()) {
      const [students, classes] = await Promise.all([
        dataStore.getStudents(),
        dataStore.getClassesBySchool(schoolId)
      ]);

      const classMap = new Map(classes.map((item) => [item.id, item.name]));
      const highRiskStudents = students
        .filter((student) => (student.schoolId === schoolId || student.school_id === schoolId))
        .filter((student) => ['high', 'critical'].includes((student.riskLevel || student.risk_level || '').toLowerCase()))
        .map((student) => ({
          id: student.id,
          name: student.name,
          className: classMap.get(student.classId || student.class_id) || '-',
          riskLevel: student.riskLevel || student.risk_level || 'high',
          riskScore: null,
          confidence: null,
          contactNumber: student.contactNumber || student.contact_number || null,
          fatherName: student.fatherName || student.father_name || null,
          motherName: student.motherName || student.mother_name || null,
          recommendations: []
        }));

      return res.json({ success: true, students: highRiskStudents });
    }

    const query = `
      SELECT
        st.id,
        st.name,
        COALESCE(c.name, '-') AS class_name,
        rp.risk_level,
        rp.risk_score,
        rp.confidence,
        st.contact_number,
        st.father_name,
        st.mother_name,
        rp.recommendations
      FROM students st
      JOIN risk_predictions rp ON rp.student_id = st.id
      LEFT JOIN classes c ON c.id = st.class_id
      WHERE st.school_id = $1
        AND rp.risk_level IN ('high', 'critical')
      ORDER BY rp.risk_score DESC NULLS LAST, st.name ASC
      LIMIT 50
    `;

    const result = await dataStore.query(query, [schoolId]);

    const students = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      className: row.class_name,
      riskLevel: row.risk_level,
      riskScore: row.risk_score !== null ? Number((Number(row.risk_score) * 100).toFixed(1)) : null,
      confidence: row.confidence,
      contactNumber: row.contact_number,
      fatherName: row.father_name,
      motherName: row.mother_name,
      recommendations: Array.isArray(row.recommendations) ? row.recommendations : []
    }));

    return res.json({ success: true, students });
  } catch (error) {
    console.error('Super admin high risk students error:', error);
    res.status(500).json({ success: false, error: 'Failed to load high-risk students' });
  }
};
