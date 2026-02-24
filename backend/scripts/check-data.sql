SELECT COUNT(*) as count, 'schools' as table_name FROM schools 
UNION ALL SELECT COUNT(*), 'users' FROM users 
UNION ALL SELECT COUNT(*), 'students' FROM students 
UNION ALL SELECT COUNT(*), 'classes' FROM classes 
UNION ALL SELECT COUNT(*), 'attendance' FROM attendance;
