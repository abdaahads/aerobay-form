INSERT INTO form_submissions (
  school_name, school_code, contact_person, contact_email, contact_phone, 
  lab_category, selected_items, custom_items, submitted_by_name, 
  target_date, additional_notes, created_at, submission_date
) VALUES
(
  'Amity International', 'SCH-1168', 'David Brown', 'contact0@example.com', '+91 9884845681',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":5,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'John Sharma',
  '2023-10-09', 'Please process ASAP', '2023-09-09T23:03:58.221Z', '2023-09-09T23:03:58.221Z'
),
(
  'Apeejay School', 'SCH-6388', 'Michael Doe', 'contact1@example.com', '+91 9879688007',
  'Advanced', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":2,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[{"itemName":"Extra safety goggles","quantity":"20","remarks":"For chemistry lab"}]'::jsonb, 'Raj Sheikh',
  '2026-05-07', NULL, '2026-04-07T19:47:18.996Z', '2026-04-07T19:47:18.996Z'
),
(
  'Amity International', 'SCH-7885', 'Priya Brown', 'contact2@example.com', '+91 9828243464',
  'Advanced', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":1,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[]'::jsonb, 'Abdul Lee',
  '2023-06-13', 'Please process ASAP', '2023-05-14T10:41:45.552Z', '2023-05-14T10:41:45.552Z'
),
(
  'Amity International', 'SCH-1637', 'Abdul Doe', 'contact3@example.com', '+91 9845359664',
  'Standard', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":4,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":3,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Emily Williams',
  '2024-03-11', NULL, '2024-02-10T15:15:12.075Z', '2024-02-10T15:15:12.075Z'
),
(
  'Sanskriti School', 'SCH-1102', 'Raj Brown', 'contact4@example.com', '+91 9874152952',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":5,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Raj Johnson',
  '2023-07-30', NULL, '2023-06-30T01:34:57.976Z', '2023-06-30T01:34:57.976Z'
),
(
  'Delhi Public School', 'SCH-2385', 'David Doe', 'contact5@example.com', '+91 9843314106',
  'Advanced', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":3,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[]'::jsonb, 'Jane Brown',
  '2026-04-17', NULL, '2026-03-18T23:24:03.699Z', '2026-03-18T23:24:03.699Z'
),
(
  'Amity International', 'SCH-1048', 'Emily Williams', 'contact6@example.com', '+91 987470856',
  'Advanced', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":2,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[{"itemName":"Extra safety goggles","quantity":"20","remarks":"For chemistry lab"}]'::jsonb, 'Michael Doe',
  '2023-06-17', 'Please process ASAP', '2023-05-18T02:22:31.417Z', '2023-05-18T02:22:31.417Z'
),
(
  'Sanskriti School', 'SCH-7176', 'Abdul Kumar', 'contact7@example.com', '+91 9870251755',
  'Premium', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":4,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":3,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[]'::jsonb, 'David Johnson',
  '2025-09-16', 'Please process ASAP', '2025-08-17T11:51:39.737Z', '2025-08-17T11:51:39.737Z'
),
(
  'St. Columba''s', 'SCH-355', 'John Kumar', 'contact8@example.com', '+91 9844364533',
  'Premium', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":5,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[]'::jsonb, 'Emily Brown',
  '2025-01-18', 'Please process ASAP', '2024-12-19T01:52:30.635Z', '2024-12-19T01:52:30.635Z'
),
(
  'Sanskriti School', 'SCH-1813', 'Emily Sharma', 'contact9@example.com', '+91 9835346544',
  'Premium', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":3,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[{"itemName":"Extra safety goggles","quantity":"20","remarks":"For chemistry lab"}]'::jsonb, 'Priya Doe',
  '2025-01-16', 'Please process ASAP', '2024-12-17T12:19:03.039Z', '2024-12-17T12:19:03.039Z'
),
(
  'Kendriya Vidyalaya', 'SCH-3852', 'Emily Doe', 'contact10@example.com', '+91 9844104658',
  'Premium', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":2,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[]'::jsonb, 'Abdul Smith',
  '2026-01-16', 'Please process ASAP', '2025-12-17T03:18:37.902Z', '2025-12-17T03:18:37.902Z'
),
(
  'Apeejay School', 'SCH-2612', 'Lisa Wong', 'contact11@example.com', '+91 9871514901',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":4,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":3,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Priya Kumar',
  '2025-05-26', NULL, '2025-04-26T10:25:39.223Z', '2025-04-26T10:25:39.223Z'
),
(
  'Modern School', 'SCH-4835', 'Abdul Wong', 'contact12@example.com', '+91 9830898022',
  'Premium', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":5,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[]'::jsonb, 'Emily Wong',
  '2025-03-09', NULL, '2025-02-07T15:04:55.428Z', '2025-02-07T15:04:55.428Z'
),
(
  'Delhi Public School', 'SCH-4189', 'Raj Johnson', 'contact13@example.com', '+91 9888463020',
  'Premium', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":5,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[{"itemName":"Extra safety goggles","quantity":"20","remarks":"For chemistry lab"}]'::jsonb, 'Abdul Sharma',
  '2024-08-08', 'Please process ASAP', '2024-07-09T05:52:38.663Z', '2024-07-09T05:52:38.663Z'
),
(
  'Sanskriti School', 'SCH-9413', 'Jane Brown', 'contact14@example.com', '+91 983255267',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":2,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'John Brown',
  '2024-02-22', NULL, '2024-01-23T02:52:05.503Z', '2024-01-23T02:52:05.503Z'
),
(
  'Springdales', 'SCH-6584', 'Lisa Kumar', 'contact15@example.com', '+91 9818040603',
  'Standard', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":4,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true}]'::jsonb, '[{"itemName":"Extra safety goggles","quantity":"20","remarks":"For chemistry lab"}]'::jsonb, 'Michael Sheikh',
  '2023-03-17', NULL, '2023-02-15T13:27:46.111Z', '2023-02-15T13:27:46.111Z'
),
(
  'Apeejay School', 'SCH-253', 'David Sheikh', 'contact16@example.com', '+91 9815061268',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":1,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true}]'::jsonb, '[{"itemName":"Extra safety goggles","quantity":"20","remarks":"For chemistry lab"}]'::jsonb, 'David Wong',
  '2024-03-23', 'Please process ASAP', '2024-02-22T12:57:37.572Z', '2024-02-22T12:57:37.572Z'
),
(
  'Sanskriti School', 'SCH-9847', 'Priya Kumar', 'contact17@example.com', '+91 9818829763',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":4,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Abdul Williams',
  '2024-10-06', 'Please process ASAP', '2024-09-06T14:57:51.038Z', '2024-09-06T14:57:51.038Z'
),
(
  'Ryan International', 'SCH-6078', 'Priya Smith', 'contact18@example.com', '+91 9889998273',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":3,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Michael Wong',
  '2024-06-10', NULL, '2024-05-11T20:54:55.682Z', '2024-05-11T20:54:55.682Z'
),
(
  'Delhi Public School', 'SCH-2328', 'Sarah Smith', 'contact19@example.com', '+91 9848980894',
  'Advanced', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":5,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[]'::jsonb, 'Emily Kumar',
  '2026-01-10', 'Please process ASAP', '2025-12-11T21:37:34.788Z', '2025-12-11T21:37:34.788Z'
),
(
  'Delhi Public School', 'SCH-5929', 'Raj Williams', 'contact20@example.com', '+91 981187095',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":4,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Priya Doe',
  '2026-02-23', NULL, '2026-01-24T02:05:47.926Z', '2026-01-24T02:05:47.926Z'
),
(
  'Apeejay School', 'SCH-4594', 'Sarah Johnson', 'contact21@example.com', '+91 9817109394',
  'Advanced', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":1,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[]'::jsonb, 'Priya Sharma',
  '2024-11-03', 'Please process ASAP', '2024-10-04T15:06:05.744Z', '2024-10-04T15:06:05.744Z'
),
(
  'Apeejay School', 'SCH-6220', 'Raj Doe', 'contact22@example.com', '+91 982909608',
  'Premium', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":5,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[]'::jsonb, 'Priya Sharma',
  '2025-02-15', NULL, '2025-01-16T13:00:43.849Z', '2025-01-16T13:00:43.849Z'
),
(
  'Ryan International', 'SCH-3438', 'Michael Sheikh', 'contact23@example.com', '+91 9868149291',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":1,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":3,"remarks":"Basic kit","included":true}]'::jsonb, '[{"itemName":"Extra safety goggles","quantity":"20","remarks":"For chemistry lab"}]'::jsonb, 'Abdul Kumar',
  '2023-10-27', NULL, '2023-09-27T09:30:21.371Z', '2023-09-27T09:30:21.371Z'
),
(
  'DAV Public', 'SCH-8830', 'Lisa Lee', 'contact24@example.com', '+91 9858266658',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":3,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Michael Sheikh',
  '2026-01-15', NULL, '2025-12-16T01:41:21.871Z', '2025-12-16T01:41:21.871Z'
),
(
  'Apeejay School', 'SCH-18', 'Jane Kumar', 'contact25@example.com', '+91 9879846516',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":2,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Sarah Brown',
  '2025-03-31', 'Please process ASAP', '2025-03-01T21:49:03.122Z', '2025-03-01T21:49:03.122Z'
),
(
  'DAV Public', 'SCH-8762', 'Raj Doe', 'contact26@example.com', '+91 9832866285',
  'Advanced', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":2,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[{"itemName":"Extra safety goggles","quantity":"20","remarks":"For chemistry lab"}]'::jsonb, 'John Sharma',
  '2025-03-08', NULL, '2025-02-06T12:44:48.870Z', '2025-02-06T12:44:48.870Z'
),
(
  'Apeejay School', 'SCH-6287', 'Lisa Doe', 'contact27@example.com', '+91 9874148052',
  'Advanced', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":2,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":3,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[]'::jsonb, 'Abdul Williams',
  '2024-11-16', 'Please process ASAP', '2024-10-17T12:11:37.679Z', '2024-10-17T12:11:37.679Z'
),
(
  'Amity International', 'SCH-3788', 'David Wong', 'contact28@example.com', '+91 9813431024',
  'Advanced', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":4,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[{"itemName":"Extra safety goggles","quantity":"20","remarks":"For chemistry lab"}]'::jsonb, 'Michael Brown',
  '2023-07-25', NULL, '2023-06-25T04:42:22.336Z', '2023-06-25T04:42:22.336Z'
),
(
  'St. Columba''s', 'SCH-5664', 'Raj Brown', 'contact29@example.com', '+91 9820634508',
  'Premium', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":5,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[{"itemName":"Extra safety goggles","quantity":"20","remarks":"For chemistry lab"}]'::jsonb, 'Jane Lee',
  '2025-10-23', NULL, '2025-09-23T20:10:24.334Z', '2025-09-23T20:10:24.334Z'
),
(
  'Modern School', 'SCH-2208', 'Lisa Smith', 'contact30@example.com', '+91 9889271653',
  'Standard', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":2,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true}]'::jsonb, '[{"itemName":"Extra safety goggles","quantity":"20","remarks":"For chemistry lab"}]'::jsonb, 'Michael Lee',
  '2025-09-15', NULL, '2025-08-16T23:15:20.329Z', '2025-08-16T23:15:20.329Z'
),
(
  'Ryan International', 'SCH-7897', 'Abdul Sharma', 'contact31@example.com', '+91 984759854',
  'Standard', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":4,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Raj Sharma',
  '2025-11-06', 'Please process ASAP', '2025-10-07T15:39:22.019Z', '2025-10-07T15:39:22.019Z'
),
(
  'Delhi Public School', 'SCH-9324', 'Raj Brown', 'contact32@example.com', '+91 9894744251',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":1,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Priya Brown',
  '2023-04-15', NULL, '2023-03-16T12:05:40.742Z', '2023-03-16T12:05:40.742Z'
),
(
  'Kendriya Vidyalaya', 'SCH-3334', 'Raj Johnson', 'contact33@example.com', '+91 9859582381',
  'Advanced', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":4,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[{"itemName":"Extra safety goggles","quantity":"20","remarks":"For chemistry lab"}]'::jsonb, 'Emily Lee',
  '2023-04-23', NULL, '2023-03-24T11:19:04.168Z', '2023-03-24T11:19:04.168Z'
),
(
  'St. Columba''s', 'SCH-4380', 'Michael Lee', 'contact34@example.com', '+91 989583170',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":5,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Lisa Sharma',
  '2026-05-08', NULL, '2026-04-08T08:42:28.309Z', '2026-04-08T08:42:28.309Z'
),
(
  'Amity International', 'SCH-5022', 'Jane Sheikh', 'contact35@example.com', '+91 9839755419',
  'Premium', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":1,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":3,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[]'::jsonb, 'Michael Sharma',
  '2026-05-05', NULL, '2026-04-05T15:07:32.816Z', '2026-04-05T15:07:32.816Z'
),
(
  'St. Columba''s', 'SCH-7583', 'Michael Smith', 'contact36@example.com', '+91 9820986369',
  'Advanced', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":1,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[]'::jsonb, 'Abdul Johnson',
  '2024-07-25', NULL, '2024-06-25T00:02:38.549Z', '2024-06-25T00:02:38.549Z'
),
(
  'Kendriya Vidyalaya', 'SCH-3384', 'Lisa Sheikh', 'contact37@example.com', '+91 9834236119',
  'Advanced', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":3,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":3,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[]'::jsonb, 'Sarah Sharma',
  '2024-07-02', 'Please process ASAP', '2024-06-02T16:39:47.655Z', '2024-06-02T16:39:47.655Z'
),
(
  'Delhi Public School', 'SCH-6127', 'Sarah Johnson', 'contact38@example.com', '+91 984517854',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":4,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'David Wong',
  '2023-07-05', 'Please process ASAP', '2023-06-05T16:10:11.573Z', '2023-06-05T16:10:11.573Z'
),
(
  'St. Columba''s', 'SCH-7225', 'Michael Kumar', 'contact39@example.com', '+91 9879151714',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":2,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Jane Johnson',
  '2023-05-09', NULL, '2023-04-09T03:55:53.612Z', '2023-04-09T03:55:53.612Z'
),
(
  'Amity International', 'SCH-6811', 'Priya Lee', 'contact40@example.com', '+91 9868874628',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":3,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":3,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Jane Kumar',
  '2025-05-12', 'Please process ASAP', '2025-04-12T06:08:03.756Z', '2025-04-12T06:08:03.756Z'
),
(
  'Modern School', 'SCH-4370', 'Jane Kumar', 'contact41@example.com', '+91 9873637153',
  'Advanced', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":1,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":3,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[]'::jsonb, 'Sarah Wong',
  '2024-04-07', NULL, '2024-03-08T01:56:06.105Z', '2024-03-08T01:56:06.105Z'
),
(
  'St. Columba''s', 'SCH-8091', 'David Lee', 'contact42@example.com', '+91 9854474514',
  'Advanced', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":3,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[]'::jsonb, 'Sarah Kumar',
  '2023-12-17', 'Please process ASAP', '2023-11-17T06:24:38.579Z', '2023-11-17T06:24:38.579Z'
),
(
  'Ryan International', 'SCH-2297', 'Emily Sheikh', 'contact43@example.com', '+91 9895622889',
  'Standard', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":5,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":3,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Michael Kumar',
  '2025-08-31', 'Please process ASAP', '2025-08-01T10:07:09.767Z', '2025-08-01T10:07:09.767Z'
),
(
  'Amity International', 'SCH-3808', 'Lisa Lee', 'contact44@example.com', '+91 9856666335',
  'Standard', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":2,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Michael Doe',
  '2025-12-17', 'Please process ASAP', '2025-11-17T18:50:14.931Z', '2025-11-17T18:50:14.931Z'
),
(
  'Kendriya Vidyalaya', 'SCH-8007', 'Jane Wong', 'contact45@example.com', '+91 9860324398',
  'Basix', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":4,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Sarah Lee',
  '2023-05-31', NULL, '2023-05-01T07:12:46.354Z', '2023-05-01T07:12:46.354Z'
),
(
  'Springdales', 'SCH-1564', 'Lisa Wong', 'contact46@example.com', '+91 9892070614',
  'Standard', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":2,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":3,"remarks":"Basic kit","included":true}]'::jsonb, '[{"itemName":"Extra safety goggles","quantity":"20","remarks":"For chemistry lab"}]'::jsonb, 'Michael Lee',
  '2026-03-23', NULL, '2026-02-21T23:34:28.506Z', '2026-02-21T23:34:28.506Z'
),
(
  'Apeejay School', 'SCH-6264', 'Abdul Lee', 'contact47@example.com', '+91 9819039090',
  'Premium', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":2,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":1,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[{"itemName":"Extra safety goggles","quantity":"20","remarks":"For chemistry lab"}]'::jsonb, 'Michael Lee',
  '2025-08-29', NULL, '2025-07-30T12:47:51.924Z', '2025-07-30T12:47:51.924Z'
),
(
  'Apeejay School', 'SCH-7650', 'Sarah Kumar', 'contact48@example.com', '+91 9887325049',
  'Premium', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":2,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":2,"remarks":"Basic kit","included":true},{"sno":3,"name":"3D Printer","group":"Advanced Tools","quantity":1,"remarks":"With filament","included":true}]'::jsonb, '[{"itemName":"Extra safety goggles","quantity":"20","remarks":"For chemistry lab"}]'::jsonb, 'Priya Sharma',
  '2026-04-23', NULL, '2026-03-24T12:01:11.667Z', '2026-03-24T12:01:11.667Z'
),
(
  'DAV Public', 'SCH-5849', 'Lisa Smith', 'contact49@example.com', '+91 9899698126',
  'Standard', '[{"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":5,"remarks":"","included":true},{"sno":2,"name":"Drone Kit","group":"Robotics","quantity":3,"remarks":"Basic kit","included":true}]'::jsonb, '[]'::jsonb, 'Jane Williams',
  '2025-12-28', NULL, '2025-11-28T17:39:11.433Z', '2025-11-28T17:39:11.433Z'
);