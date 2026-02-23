import dataStore from '../storage/dataStore.js';

// Get all schools
export const getAllSchools = async (req, res) => {
  try {
    const schools = await dataStore.getSchools();
    
    // Sort alphabetically by name
    const sortedSchools = schools
      .map(school => ({
        id: school.id,
        name: school.name,
        city: school.city,
        state: school.state
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      schools: sortedSchools
    });
  } catch (error) {
    console.error('Get schools error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get schools' 
    });
  }
};

// Get school by ID
export const getSchoolById = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const school = await dataStore.getSchoolById(schoolId);

    if (!school) {
      return res.status(404).json({ 
        success: false, 
        error: 'School not found' 
      });
    }

    res.json({
      success: true,
      school: {
        id: school.id,
        name: school.name,
        address: school.address,
        city: school.city,
        state: school.state,
        phone: school.phone
      }
    });
  } catch (error) {
    console.error('Get school error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get school' 
    });
  }
};
