# Example flow create Fincode Order and purchase with card and 3DS2.0

## Prepare

- get Fincode secret key and public key at [Fincode config](https://dashboard.test.fincode.jp/development/config)
- create `.env` file: `cp .env.example .env`
- update `FINCODE_SK`, `NEXT_PUBLIC_FINCODE_PK` in `.env`

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

## Apple pay
### Setup
- See the [Doc](https://docs.fincode.jp/payment/applepay/setup)

### Certs
- After setup Payment processing, need to setup certificate for validate Apple pay token

1. Get `Certificates.p12` file from MerchantID Certificate
1. Get `MerchantIDCertificates.key.pem` and `MerchantIDCertificates.pem` from `MerchantIDCertificates.p12` file
    ```bash
      openssl pkcs12 -in MerchantIDCertificates.p12 -out MerchantIDCertificates.pem -clcerts -nokeys
      openssl pkcs12 -in MerchantIDCertificates.p12 -out MerchantIDCertificates.key.pem -nocerts -nodes
    ```
1. Move `MerchantIDCertificates.key.pem`, `MerchantIDCertificates.pem` in to `certs` folder

### Try
- Go to `http://localhost:3000/apple-pay` to try
