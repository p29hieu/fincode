# Example flow create Fincode Order and purchase with card and 3DS2.0

## Prepare
  - get Fincode secret key and public key at [Fincode config](https://dashboard.test.fincode.jp/development/config)
  - update `FINCODE_SK`, `NEXT_PUBLIC_FINCODE_PK` in `.env.development`

## Required
  - Nodejs >= 18
  - [Pnpm](https://pnpm.io/)

## Install library
```bash
  $ pnpm install
```

## Run
```bash
  $ pnpm dev
```

  - Then Go to `localhost:3000/payment`
  - If you already have `customerId`, input it and click `Get card`, then choose the card. If no, click `Payment with card`, input the card info, then click `Get Card token`
  - Click `Create order` if you want to create the new Fincode order.
  - Click `Purchase`
