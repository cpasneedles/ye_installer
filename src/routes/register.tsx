import { Layout } from "..";

const Register = () =>
    <Layout>
        <form action="#" method="post">
            <div>
                <h2>Register</h2>
                <h3>Create your Ye account.</h3>
            </div>
            <input type="text" name="username" required />
            <input type="email" name="email" required />
            <input type="password" name="password" required />
        </form>
    </Layout>
export default Register;