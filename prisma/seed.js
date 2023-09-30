//seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  try {
    const user = await prisma.user.create({
      data: {
        username: 'Madhuri',
        email: 'admin@example.com',
        // this is a hashed version of "twixrox"
        passwordHash:
          '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
        userRoles: {
          create: [
            {
              role: {
                create: {
                  roleName: 'Admin',
                  isSystem: true,
                },
              },
            },
          ],
        },
      },
    });

    console.log('Admin user created or found.');

    // Define roles
    const roles = [
      {
        roleName: 'User',
      },
    ];

    for (const roleRecord of roles) {
      const role = await prisma.role.create({
        data: roleRecord,
      });

      console.log(`Role "${role.roleName}" created.`);
    }

    // Associate the "User" role with the user
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: 1, // Assuming "User" role has ID 1 in the roles table
      },
    });

    console.log('User role associated with the user.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// async function seed() {
//   try {
//     const user = await prisma.user.create({
//       data: {
//         username: 'Madhuri',
//         email: 'admin@example.com',
//         // this is a hashed version of "twixrox"
//         passwordHash:
//           '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
//       },
//     });

//     console.log('Admin user created or found.');

//     // Define roles
//     const roles = [
//       {
//         roleName: 'User',
//       },
//       {
//         roleName: 'Admin',
//         isSystem: true,
//       },
//     ];

//     for (const roleRecord of roles) {
//       const role = await prisma.role.create({
//         data: roleRecord,
//       });

//       console.log(`Role "${role.roleName}" created.`);
//     }

//   } catch (error) {
//     console.error('Error seeding data:', error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// seed();
