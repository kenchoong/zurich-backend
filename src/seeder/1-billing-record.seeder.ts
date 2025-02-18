import { Seeder } from '@jorgebodega/typeorm-seeding';
import { BillingRecordEntity } from '../modules/billing-record/billing-record.entity';
import { DataSource } from 'typeorm';

export default class BillingRecordSeeder extends Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const data = [
      {
        email: 'george.bluth@yahoo.com.my',
        firstName: 'George',
        lastName: 'Bluth',
        photo: 'https://reqres.in/img/faces/1-image.jpg',
        productId: '3000',
        location: 'West Malaysia',
        premiumPaidAmount: 4432,
      },
      {
        email: 'janet.weaver@gmail.com',
        firstName: 'Janet',
        lastName: 'Weaver',
        photo: 'https://reqres.in/img/faces/2-image.jpg',
        productId: '4000',
        location: 'East Malaysia',
        premiumPaidAmount: 1299,
      },
      {
        email: 'emma.wong@mailsaur.net',
        firstName: 'Emma',
        lastName: 'Wong',
        photo: 'https://reqres.in/img/faces/3-image.jpg',
        productId: '5000',
        location: 'West Malaysia',
        premiumPaidAmount: 4910,
      },
      {
        email: 'eve.holt@googlemail.co.com',
        firstName: 'Eve',
        lastName: 'Holt',
        photo: 'https://reqres.in/img/faces/4-image.jpg',
        productId: '3000',
        location: 'East Malaysia',
        premiumPaidAmount: 2199,
      },
      {
        email: 'charles.morris@grbamart.co.my',
        firstName: 'Charles',
        lastName: 'Morris',
        photo: 'https://reqres.in/img/faces/5-image.jpg',
        productId: '4000',
        location: 'West Malaysia',
        premiumPaidAmount: 4499,
      },
      {
        email: 'tracey.ramos@mailinator.co.my',
        firstName: 'Tracey',
        lastName: 'Ramos',
        photo: 'https://reqres.in/img/faces/6-image.jpg',
        productId: '5000',
        location: 'East Malaysia',
        premiumPaidAmount: 3399,
      },
      {
        email: 'michael.lawson@gmail.co.my',
        firstName: 'Michael',
        lastName: 'Lawson',
        photo: 'https://reqres.in/img/faces/7-image.jpg',
        productId: '3000',
        location: 'West Malaysia',
        premiumPaidAmount: 5599,
      },
      {
        email: 'lindsay.ferguson@mailinator.co.my',
        firstName: 'Lindsay',
        lastName: 'Ferguson',
        photo: 'https://reqres.in/img/faces/8-image.jpg',
        productId: '4000',
        location: 'East Malaysia',
        premiumPaidAmount: 6699,
      },
      {
        email: 'tobias.funke@gmail.co.my',
        firstName: 'Tobias',
        lastName: 'Funke',
        photo: 'https://reqres.in/img/faces/9-image.jpg',
        productId: '5000',
        location: 'West Malaysia',
        premiumPaidAmount: 7799,
      },
      {
        email: 'byron.fields@mailinator.co.my',
        firstName: 'Byron',
        lastName: 'Fields',
        photo: 'https://reqres.in/img/faces/10-image.jpg',
        productId: '3000',
        location: 'East Malaysia',
        premiumPaidAmount: 8899,
      },
      {
        email: 'george.edwards@gmail.co.my',
        firstName: 'George',
        lastName: 'Edwards',
        photo: 'https://reqres.in/img/faces/11-image.jpg',
        productId: '4000',
        location: 'West Malaysia',
        premiumPaidAmount: 9999,
      },
      {
        email: 'rachel.howell@mailinator.co.my',
        firstName: 'Rachel',
        lastName: 'Howell',
        photo: 'https://reqres.in/img/faces/12-image.jpg',
        productId: '5000',
        location: 'East Malaysia',
        premiumPaidAmount: 11199,
      },
    ];

    const repository = dataSource.getRepository(BillingRecordEntity);
    await repository.save(data);
  }
}
