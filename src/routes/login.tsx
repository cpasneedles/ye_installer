import { Layout } from "..";

const Login = () =>
    <Layout>
        <form action="#" method="post">
            <div>
                <h2>Login</h2>
                <h3>Use your Yebot account to connect.</h3>
            </div>
            <input type="email" name="email" required />
            <input type="password" name="password" required />
        </form>
    </Layout>
export default Login;