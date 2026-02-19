const User = require('../models/User'); // Changed to ../ to go out of utlis folder

const seedInstructors = async () => {
  try {
    const defaultInstructors = [
      {
        name: 'Varun Chauhan',
        email: 'vc28022004@gmail.com',
        password: 'Techiguru@13579',
        role: 'instructor',
      },
      {
        name: 'TechiGuru Official',
        email: 'techiguru.in@gmail.com',
        password: 'Techiguru@13579',
        role: 'instructor',
      }
    ];

    for (const instructor of defaultInstructors) {
      const userExists = await User.findOne({ email: instructor.email });
      
      if (!userExists) {
        await User.create(instructor);
        console.log(`✅ Default instructor created: ${instructor.email}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error creating default instructors: ${error.message}`);
  }
};

// Fixed Export (CommonJS)
module.exports = seedInstructors;