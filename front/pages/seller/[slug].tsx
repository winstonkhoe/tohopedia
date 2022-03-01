import { useRouter } from 'next/router'

const User = () => {
  const router = useRouter()
  const { slug } = router.query

  return <p>User: {slug}</p>
}

export default User