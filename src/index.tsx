/* @refresh reload */
import { render } from "solid-js/web";
import { Component, createSignal, JSX, onCleanup, onMount } from "solid-js";
import { Route, Router } from "@solidjs/router";
import { getCurrentWindow } from '@tauri-apps/api/window';
import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'

async function checkForUpdates() {
    try {
        const update = await check();
        if (update?.available) {
            await update.downloadAndInstall();
            await relaunch();
        }
    } catch (error) {
        console.error("Failed to check for updates:", error);
    }
}

checkForUpdates();

import * as OnTheWay from "./routes";
import Navbar from "./components/navbar";

export interface Message {
    content: string;
    bg: "bg-success/20" | "bg-danger/20" | "bg-warning/20";
    text: "text-success" | "text-danger" | "text-warning";
    icon: "check" | "x" | "warning";
}

export const Layout: Component<{ children: JSX.Element }> = (props) => {
    const appWindow = getCurrentWindow();

    const [isMaximized, setIsMaximized] = createSignal(false);

    async function updateState() {
        setIsMaximized(await appWindow.isMaximized());
    }

    onMount(async () => {
        await updateState();
        const unlisten = await appWindow.onResized(updateState);

        onCleanup(() => {
            unlisten();
        });
    });

    async function toggleMaximize() {
        if (isMaximized()) {
            await appWindow.unmaximize();
        } else {
            await appWindow.maximize();
        }
        await updateState();
    }

    return (
        <div class="flex">
            <header class="z-50">
                <div data-tauri-drag-region class="select-none fixed flex justify-end top-0 left-0 right-0 h-8 bg-background">
                    <div>
                        <button title="Minimize" class="w-8 h-8 px-6 inline-flex items-center justify-center cursor-pointer hover:bg-secondary/20" onclick={async () => await appWindow.minimize()}>
                            <i class="ph ph-minus"></i>
                        </button>
                        <button
                            title={isMaximized() ? "Restore" : "Maximize"}
                            class="w-8 h-8 px-6 inline-flex items-center justify-center cursor-pointer hover:bg-secondary/20"
                            onclick={toggleMaximize}
                        >
                            <i class="ph-fill ph-arrows-out-simple"></i>
                        </button>
                        <button title="Close" class="w-8 h-8 px-6 inline-flex items-center justify-center cursor-pointer hover:bg-danger" onclick={async () => await appWindow.close()}>
                            <i class="ph ph-x"></i>
                        </button>
                    </div>
                </div>
                <Navbar />
            </header>
            <main class="w-full ml-64 mt-8">
                <div class="px-12 py-6">
                    {props.children}
                </div>
            </main>
        </div>
    );
};

render(() => (
    <Router>
        <Route path="/" component={OnTheWay.Home} />
        <Route path="/filters" component={OnTheWay.Filters} />
        <Route path="/stats" component={OnTheWay.Stats} />
        <Route path="/profile" component={OnTheWay.Profile} />
        <Route path="/settings" component={OnTheWay.Settings} />
        <Route path="*404" component={OnTheWay.NotFound} />
    </Router>
), document.getElementById("root") as HTMLElement);