const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Competition = require('./models/Competition');
const Team = require('./models/Team');
const Achievement = require('./models/Achievement');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Competition.deleteMany({});
    await Team.deleteMany({});
    await Achievement.deleteMany({});

    // Create users
    const users = await User.create([
      {
        name: 'Lilly Johnson',
        email: 'lilly@example.com',
        password: 'password123',
        university: 'NJU',
        major: 'Computer Science',
        gpa: 4.1,
        mbti: 'ENFP',
        skills: ['React', 'UI/UX', 'JavaScript', 'Figma'],
        bio: 'Passionate frontend developer and designer',
        profileScore: 87
      },
      {
        name: 'Junho Kim',
        email: 'junho@example.com',
        password: 'password123',
        university: 'NJU',
        major: 'Software Engineering',
        gpa: 3.8,
        mbti: 'INTJ',
        skills: ['React', 'Node.js', 'Hackathon', 'TypeScript'],
        bio: 'Frontend Developer passionate about hackathons'
      },
      {
        name: 'Mina Park',
        email: 'mina@example.com',
        password: 'password123',
        university: 'ENU',
        major: 'Data Science',
        gpa: 3.9,
        mbti: 'INTP',
        skills: ['Python', 'Research', 'Statistics', 'Machine Learning'],
        bio: 'Data Analyst with a love for research'
      },
      {
        name: 'Sara Lee',
        email: 'sara@example.com',
        password: 'password123',
        university: 'ENU',
        major: 'Business Administration',
        gpa: 3.7,
        mbti: 'ENTJ',
        skills: ['Leadership', 'Agile', 'PM', 'Strategy'],
        bio: 'PM / Strategist focused on team dynamics'
      }
    ]);

    console.log('✅ Users created');

    // Create competitions
    const competitions = await Competition.create([
      {
        title: 'Design Innovation Contest',
        description: 'Create innovative UI/UX designs for real-world problems',
        category: 'design',
        organizer: 'Tech University Alliance',
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-06-30'),
        deadline: new Date('2024-05-20'),
        prize: '$5,000',
        requiredSkills: ['UI/UX', 'Figma', 'React', 'Design Thinking'],
        maxTeamSize: 4,
        minTeamSize: 2,
        status: 'active',
        tags: ['design', 'innovation', 'UI/UX']
      },
      {
        title: 'AI Hackathon 2024',
        description: 'Build AI-powered solutions in 48 hours',
        category: 'hackathon',
        organizer: 'AI Research Institute',
        startDate: new Date('2024-06-15'),
        endDate: new Date('2024-06-17'),
        deadline: new Date('2024-06-10'),
        prize: '$10,000',
        requiredSkills: ['Python', 'Machine Learning', 'React', 'Node.js'],
        maxTeamSize: 5,
        minTeamSize: 3,
        status: 'upcoming',
        tags: ['AI', 'hackathon', 'machine learning']
      },
      {
        title: 'Business Strategy Challenge',
        description: 'Develop and present a business strategy for a startup',
        category: 'business',
        organizer: 'Business School Network',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-31'),
        deadline: new Date('2024-06-25'),
        prize: '$3,000',
        requiredSkills: ['Leadership', 'Strategy', 'PM', 'Agile'],
        maxTeamSize: 4,
        minTeamSize: 2,
        status: 'upcoming',
        tags: ['business', 'strategy', 'startup']
      }
    ]);

    console.log('✅ Competitions created');

    // Create teams
    const team = await Team.create({
      name: 'Design Innovators',
      description: 'Team focused on Design Innovation Contest',
      competition: competitions[0]._id,
      leader: users[0]._id,
      members: [
        { user: users[0]._id, role: 'leader' },
        { user: users[1]._id, role: 'member' }
      ],
      requiredSkills: ['UI/UX', 'React', 'Figma'],
      maxMembers: 4,
      status: 'recruiting'
    });

    console.log('✅ Teams created');

    // Create achievements
    await Achievement.create([
      {
        user: users[0]._id,
        title: 'Welcome to IT-Run!',
        description: 'You joined the platform',
        type: 'profile',
        icon: '🎉',
        isNew: false
      },
      {
        user: users[0]._id,
        title: 'Profile Pro',
        description: 'Completed your profile to 80%+',
        type: 'profile',
        icon: '⭐',
        isNew: false
      },
      {
        user: users[0]._id,
        title: 'Team Builder',
        description: 'Created your first team',
        type: 'team',
        icon: '👥',
        isNew: true
      },
      {
        user: users[0]._id,
        title: 'First Competition',
        description: 'Joined your first competition',
        type: 'competition',
        icon: '🏆',
        isNew: true
      },
      {
        user: users[0]._id,
        title: 'Skill Master',
        description: 'Added 4+ skills to your profile',
        type: 'skill',
        icon: '💡',
        isNew: true
      }
    ]);

    console.log('✅ Achievements created');
    console.log('\n🎉 Seed completed successfully!');
    console.log('\nDemo login credentials:');
    console.log('  Email: lilly@example.com');
    console.log('  Password: password123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
