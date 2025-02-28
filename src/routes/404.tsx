import { A } from "@solidjs/router";
import { Layout } from "..";

const Notfound = () => (
    <Layout>
        <div class="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center">
            <h1 class="text-8xl font-extrabold tracking-wide text-primary">404</h1>
            <p class="text-lg text-secondary">Oops! The page you’re looking for doesn’t exist.</p>
            <A href="/" class="flex items-center gap-2 bg-primary font-medium text-background py-2.5 px-4 rounded-xl transition-all hover:bg-primary/90">
                <i class="ph ph-arrow-left"></i> Back to Home
            </A>
        </div>
    </Layout>
);

export default Notfound;
