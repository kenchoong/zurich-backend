import { Seeder } from '@jorgebodega/typeorm-seeding';
import { BillingEntity } from '../modules/billing/billing.entity';
import { DataSource } from 'typeorm';

export default class BillingSeeder extends Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const data = [
      {
        email: 'george.bluth@yahoo.com.my',
        firstName: 'George',
        lastName: 'Bluth',
        photo: 'https://reqres.in/img/faces/1-image.jpg',
        productId: '3000',
        location: 'West Malaysia',
        premiumPaidAmount: 44.32,
      },
      {
        email: 'janet.weaver@gmail.com',
        firstName: 'Janet',
        lastName: 'Weaver',
        photo: 'https://reqres.in/img/faces/2-image.jpg',
        productId: '4000',
        location: 'East Malaysia',
        premiumPaidAmount: 12.99,
      },
      {
        email: 'emma.wong@mailsaur.net',
        firstName: 'Emma',
        lastName: 'Wong',
        photo: 'https://reqres.in/img/faces/3-image.jpg',
        productId: '5000',
        location: 'West Malaysia',
        premiumPaidAmount: 49.1,
      },
      {
        email: 'eve.holt@googlemail.co.com',
        firstName: 'Eve',
        lastName: 'Holt',
        photo: 'https://reqres.in/img/faces/4-image.jpg',
        productId: '3000',
        location: 'East Malaysia',
        premiumPaidAmount: 21.99,
      },
      {
        email: 'charles.morris@grbamart.co.my',
        firstName: 'Charles',
        lastName: 'Morris',
        photo: 'https://reqres.in/img/faces/5-image.jpg',
        productId: '4000',
        location: 'West Malaysia',
        premiumPaidAmount: 44.99,
      },
      {
        email: 'tracey.ramos@esria.org',
        firstName: 'Tracey',
        lastName: 'Ramos',
        photo: 'https://reqres.in/img/faces/6-image.jpg',
        productId: '5000',
        location: 'East Malaysia',
        premiumPaidAmount: 32.5,
      },
      {
        email: 'michael.jackson@sony.com',
        firstName: 'Michael',
        lastName: 'Jackson',
        photo: 'https://reqres.in/img/faces/7-image.jpg',
        productId: '3000',
        location: 'West Malaysia',
        premiumPaidAmount: 31.0,
      },
      {
        email: 'gwendolyn.fyn@live.com',
        firstName: 'Gwendolyn',
        lastName: 'Fyn',
        photo: 'https://reqres.in/img/faces/8-image.jpg',
        productId: '4000',
        location: 'East Malaysia',
        premiumPaidAmount: 52.65,
      },
      {
        email: 'tobias.funke@docomo.co.jp',
        firstName: 'Tobias',
        lastName: 'Funke',
        photo: 'https://reqres.in/img/faces/9-image.jpg',
        productId: '3000',
        location: 'West Malaysia',
        premiumPaidAmount: 19.22,
      },
      {
        email: 'byron.fields@googlemail.co.uk',
        firstName: 'Byron',
        lastName: 'Fields',
        photo: 'https://reqres.in/img/faces/10-image.jpg',
        productId: '4000',
        location: 'East Malaysia',
        premiumPaidAmount: 33.0,
      },
      {
        email: 'edwards.wild@rocketmail.com',
        firstName: 'Edwards',
        lastName: 'Wild',
        photo: 'https://reqres.in/img/faces/11-image.jpg',
        productId: '3000',
        location: 'West Malaysia',
        premiumPaidAmount: 15.0,
      },
      {
        email: 'rachel.winters@aol.com',
        firstName: 'Rachel',
        lastName: 'Winters',
        photo: 'https://reqres.in/img/faces/12-image.jpg',
        productId: '5000',
        location: 'East Malaysia',
        premiumPaidAmount: 60.99,
      },
    ];

    const billingRecords = data.map(async (value) => {
      const billing = new BillingEntity();
      billing.email = value.email;
      billing.firstName = value.firstName;
      billing.lastName = value.lastName;
      billing.photo = value.photo;
      billing.productId = value.productId;
      billing.location = value.location;
      billing.premiumPaidAmount = value.premiumPaidAmount * 100;
      return billing;
    });

    const billingEntities = await Promise.all(billingRecords);
    await dataSource.createEntityManager().save(BillingEntity, billingEntities);
  }
}
