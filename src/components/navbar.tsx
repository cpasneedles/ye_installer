import { A } from '@solidjs/router';

export default function Navbar() {
    return (
        <nav data-tauri-drag-region class="select-none fixed w-64 top-0 bottom-0 flex flex-col bg-secondary/20">
            <div class="h-8 pointer-events-none flex justify-center items-center">
                <p class="text-xs">YEBOT</p>
            </div>
            <div class='flex-1 flex flex-col p-6'>
                {/* <ul class='mb-4'>
                    <li>
                        <A class="group flex items-center h-10 px-3 gap-3 rounded-xl hover:bg-primary/20 transition-colors"
                            activeClass='text-primary' href="/profile">
                            <img src="/assets/logo.png" alt="profile picture"
                                class="h-6 w-6" />
                            <span>cpasneedles</span>
                        </A>
                    </li>
                </ul> */}
                <ul class='flex-1 flex flex-col w-full'>
                    <li>
                        <A class="group flex items-center h-10 px-3 gap-3 rounded-xl hover:bg-primary/20 transition-colors"
                            activeClass='text-primary' href="/" end>
                            <i class="ph ph-house text-xl group-data-[active]:ph-fill"></i>
                            <span>Home</span>
                        </A>
                    </li>
                    <li>
                        <A class="group flex items-center h-10 px-3 gap-3 rounded-xl hover:bg-primary/20 transition-colors"
                            activeClass='text-primary' href="/filters">
                            <i class="ph ph-funnel text-xl"></i>
                            <span>Filters</span>
                        </A>
                    </li>
                    <li>
                        <A class="group flex items-center h-10 px-3 gap-3 rounded-xl hover:bg-primary/20 transition-colors"
                            activeClass='text-primary' href="/stats">
                            <i class="ph ph-trend-up text-xl"></i>
                            <span>Stats</span>
                        </A>
                    </li>
                    <li>
                        <A class="group flex items-center h-10 px-3 gap-3 rounded-xl hover:bg-primary/20 transition-colors"
                            activeClass='text-primary' href="/settings">
                            <i class="ph ph-gear text-xl"></i>
                            <span>Settings</span>
                        </A>
                    </li>
                </ul>
                <footer class='flex flex-col text-center'>
                    <a class='text-sm underline hover:no-underline text-secondary w-fit mx-auto' href="https://yebot.fr/legal" target='_blank'>Legal</a>
                    <span class="text-xs text-secondary">© 2025, Ye, tous droits réservés.</span>
                </footer>
            </div>
        </nav>
    );
}