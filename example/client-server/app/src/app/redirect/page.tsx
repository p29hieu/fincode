"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ValidatePaymentPage = () => {
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState<string>();

  useEffect(() => {
    const { url } = router.query;
    if (url) {
      setTimeout(() => {
        setRedirectUrl(`${url}`);
        router.replace(`${url}`);
      }, 300);
    }
  }, [router]);

  return (
    <div>
      Redirecting... to {redirectUrl}
      <div>
        <a href={redirectUrl} target="_blank">
          Click here to redirect
        </a>
      </div>
    </div>
  );
};

export default ValidatePaymentPage;
