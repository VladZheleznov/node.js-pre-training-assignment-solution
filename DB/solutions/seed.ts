import { AppDataSource } from '../../data-source';
import { User } from './entities/user.entity';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding');

    const userRepository = AppDataSource.getRepository(User);

    const user1 = userRepository.create({
      name: 'Alex',
      email: 'alex@gmail.com',
      todos: [
        { title: 'todo example for Alex', description: 'important' },
        { title: 'old todo', status: 'completed' },
        { title: 'learn db' },
      ],
    });
    const user2 = userRepository.create({
      name: 'Rob',
      email: 'rob@gmail.com',
      todos: [
        { title: 'todo for Rob', description: 'todo about ...' },
        { title: 'completed todo', status: 'completed' },
        { title: 'example todo' },
      ],
    });

    await userRepository.save([user1, user2]);
    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Something went wrong', err);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
