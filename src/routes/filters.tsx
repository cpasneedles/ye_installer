import { Layout, Message } from "..";
import { createSignal, onCleanup, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import FilterForm from "../components/filter_form";

const Filters = () => {
    const [showForm, setShowForm] = createSignal<boolean>(false);
    const [filters, setFilters] = createSignal<Array<Record<string, any>>>([]);
    const [msg, setMsg] = createSignal<Message | null>(null);
    const [tooltip, setTooltip] = createSignal<{ x: number; y: number; filter: Object; } | null>(null);

    onMount(async () => {
        setFilters([]);

        let result: any = await invoke("select_filter_all");

        if (!Array.isArray(result)) {
            console.error("Expected an array but got:", result);
            setMsg({ content: "An unexpected error occurred while retrieving filters.", text: "text-danger", bg: "bg-danger/20", icon: "x" });
            return;
        }

        setFilters(result);

        document.addEventListener("click", () => setTooltip(null));
    });

    onCleanup(() => {
        document.removeEventListener("click", () => setTooltip(null));
    });

    async function deleteFilter(filter: any) {
        let result: any = await invoke("delete_filter", {
            filter
        });

        if (typeof result != "object") {
            console.error("Expected an object but got:", result);
            setMsg({ content: "An unexpected error occurred while deleting filter.", text: "text-danger", bg: "bg-danger/20", icon: "x" });
            return;
        }

        setFilters(filters().filter((f) => f.id !== filter.id));
    }

    function handleRightClick(e: MouseEvent, filter: Object) {
        e.preventDefault();
        setTooltip({ x: e.clientX, y: e.clientY, filter });
    }

    return (
        <Layout>
            {showForm() && <FilterForm setShowForm={setShowForm} setFilters={setFilters} />}
            <header class="mb-8">
                <div class="flex justify-between">
                    <div>
                        <h2 class="text-3xl mb-2 font-medium">Filters</h2>
                        <h3 class="text-secondary">Create and manage your filters here.</h3>
                    </div>
                    <div class="flex items-center">
                        <button class="flex items-center justify-center w-10 h-10 text-primary bg-primary/10 hover:bg-primary/20 ring-1 ring-inset ring-primary/20 rounded-full 
                cursor-pointer transition-colors"
                            onclick={() => setShowForm((prev) => !prev)}>
                            <i class="text-xl ph ph-plus"></i>
                        </button>
                    </div>
                </div>
                {msg() && <div class={`mt-2 ${msg()?.bg} ${msg()?.text}`}><i class={`ph ph-${msg()?.icon}`}></i> {msg()?.content}</div>}
            </header>
            <div>
                <table class="select-none table-auto w-full border-collapse">
                    <thead>
                        <tr>
                            <th class="bg-secondary/20 px-4 py-2 text-left rounded-tl-xl ">Name</th>
                            <th class="bg-secondary/20 px-4 py-2 text-left">Active</th>
                            <th class="bg-secondary/20 px-4 py-2 text-left">Autocop</th>
                            <th class="bg-secondary/20 px-4 py-2 text-left rounded-tr-xl">Params</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filters().map((filter) => (
                            <tr
                                class="border-b border-secondary/20 hover:bg-secondary/10 transition-all"
                                oncontextmenu={(e) => handleRightClick(e, filter)}>
                                <td class="px-4 py-3 font-medium">{filter.name}</td>
                                <td class="px-4 py-3">
                                    <div class="flex">
                                        <i class={`text-xl ph ph-${filter.active ? "check text-success" : "x text-danger"}`}></i>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex">
                                        <i class={`text-xl ph ph-${filter.autocop ? "check text-success" : "x text-danger"}`}></i>
                                    </div>
                                </td>
                                <td class="text-xs px-4 py-3 font-light">{filter.params}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {tooltip() && (
                <div
                    style={{
                        position: "fixed",
                        top: `${tooltip()?.y}px`,
                        left: `${tooltip()?.x}px`,
                    }}
                    class="z-50 bg-neutral-dark border border-secondary/20 rounded-2xl shadow-lg p-2"
                >
                    <button
                        class="cursor-pointer flex items-center gap-3 px-3 py-1 text-danger hover:bg-danger/20 rounded-xl transition-all"
                        onclick={() => deleteFilter(tooltip()!.filter)}
                    >
                        <i class="ph ph-trash"></i> Delete
                    </button>
                </div>
            )}
        </Layout>
    )
}
export default Filters;