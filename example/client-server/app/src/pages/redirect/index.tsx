"use client"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ValidatePaymentPage = () => {
  const router = useRouter()
  const [redirectUrl, setRedirectUrl] = useState<string>()

  useEffect(() => {
    const { url } = router.query;
    if (url) {
      setRedirectUrl(`${url}`)
      // router.replace(`${url}`)
      window.open(`${url}`, '_blank')
    }
  }, [router])

  return <div>
    Redirecting...
    <div>
      <a href={redirectUrl} target="_blank">{redirectUrl}</a>
    </div>
  </div>
}

export default ValidatePaymentPage;