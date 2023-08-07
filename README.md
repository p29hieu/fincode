# Install
```bash
  yarn add fincode
```

# Use

1. Create `.env` file
2. Create `FINCODE_PK` and `FINCODE_SK` in `.env` file
3. Create `index.ts` and use this lines
4. Enjoy it <3
```typescript
  import { config } from 'dotenv';
  config(); // config env
  import { FincodeService } from "fincode";

  const main = async () => {
    FincodeService.i.config({
      secretKey: process.env.FINCODE_SK,
      publicKey: process.env.FINCODE_PK
    });
    const customerCreated = await FincodeService.i.postCustomers({
      email: CUSTOMER_EMAIL,
      name: CUSTOMER_NAME,
    });
    console.log(customerCreated);
  }
  main();
```

> see `example/client-server/app`