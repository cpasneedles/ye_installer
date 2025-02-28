import { invoke } from "@tauri-apps/api/core";
import { createSignal, Setter } from "solid-js";
import { Message } from "..";

interface FilterFormProps {
    setShowForm: Setter<boolean>;
    setFilters: Setter<Array<Record<string, any>>>
}

export default function FilterForm({ setShowForm, setFilters }: FilterFormProps) {
    const [msg, setMsg] = createSignal<Message | null>(null);

    const [filterName, setFilterName] = createSignal<string | null>(null);
    const [filterVintedSearchUrl, setFilterVintedSearchUrl] = createSignal<string | null>(null);

    async function create_filter(e: Event) {
        e.preventDefault();
        setMsg(null);

        try {
            if (!filterName() || !filterVintedSearchUrl()) {
                setMsg({ content: "You must provide both a filter name and a Vinted search URL.", text: "text-danger", bg: "bg-danger/20", icon: "x" });
                return;
            }

            let result: any = await invoke("select_filter_by_params", {
                vintedSearchUrl: filterVintedSearchUrl(),
            });

            if (!Array.isArray(result)) {
                console.error("Expected an array but got:", result);
                setMsg({ content: "An unexpected error occurred while retrieving filters.", text: "text-danger", bg: "bg-danger/20", icon: "x" });
                return;
            }

            if (result.length > 0) {
                setMsg({ content: "A filter with this URL already exists.", text: "text-warning", bg: "bg-warning/20", icon: "warning" });
                return;
            }

            let createResult: any = await invoke("create_filter", {
                name: filterName(),
                vintedSearchUrl: filterVintedSearchUrl(),
            });

            if (typeof createResult !== "object") {
                console.error("Unexpected response from create_filter:", createResult);
                setMsg({ content: "Failed to create filter due to an unexpected error.", text: "text-danger", bg: "bg-danger/20", icon: "x" });
                return;
            }

            setFilters((prev) => [...prev, createResult]);
            setMsg({ content: "Filter created successfully!", text: "text-success", bg: "bg-success/20", icon: "check" });
        } catch (e: any) {
            setMsg({ content: e.toString(), text: "text-danger", bg: "bg-danger/20", icon: "x" });
        }
    }

    let isMouseDownInside = false;

    return (
        <div
            onMouseDown={(e) => isMouseDownInside = e.target === e.currentTarget}
            onMouseUp={(e) => {
                if (isMouseDownInside && e.target === e.currentTarget) {
                    setShowForm(false);
                }
            }}
            class="z-40 flex flex-col items-center justify-center fixed top-0 left-64 right-0 bottom-0 bg-neutral-dark/80">
            <form onsubmit={create_filter} onClick={(e) => e.stopPropagation()} class="py-16 px-8 w-100 bg-neutral-dark border border-secondary/20 rounded-xl">
                <header class="mb-8">
                    <div>
                        <h2 class="text-3xl mb-2">Filter</h2>
                        <h3 class="text-secondary">
                            *URL: Go to the{" "}
                            <a href="https://www.vinted.fr/catalog" target="_blank" class="underline hover:no-underline text-brand-vinted transition-all">
                                Vinted
                            </a>{" "}
                            site and create your filter there, search, then copy/paste the URL.
                        </h3>
                    </div>
                </header>
                {msg() &&
                    <div class={`flex items-center gap-2.5 rounded-xl p-2.5 ${msg()?.bg} ${msg()?.text} mb-8`}>
                        <i class={`ph ph-${msg()?.icon}`}></i>
                        <p>{msg()?.content}</p>
                    </div>
                }
                <div class="flex flex-col gap-4">
                    <input
                        onChange={(e) => setFilterName(e.target.value)}
                        class="select-none bg-neutral-dark placeholder:text-secondary/70 border border-secondary/80 outline-none focus:ring-2 ring-primary py-2.5 px-4 rounded-xl"
                        type="text"
                        placeholder="*Name"
                        minLength={3}
                        required
                    />
                    <input
                        onChange={(e) => setFilterVintedSearchUrl(e.target.value)}
                        class="select-none bg-neutral-dark placeholder:text-secondary/70 border border-secondary/80 outline-none focus:ring-2 ring-primary py-2.5 px-4 rounded-xl"
                        type="text"
                        placeholder="*URL"
                        required
                    />
                    <input class="cursor-pointer text-neutral-dark bg-primary hover:bg-primary/80 py-2.5 px-4 rounded-xl transition-all" type="submit" value="Create" />
                </div>
            </form>
        </div>
    );
}
