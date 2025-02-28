import { Layout } from ".."
import { createSignal, onCleanup, onMount } from "solid-js";
import { listen } from "@tauri-apps/api/event";

const Home = () => {
    const [items, setItems] = createSignal<Array<any>>([]);

    onMount(async () => {
        const unlisten = await listen("new_vinted_items", (event: any) => {
            setItems((prev) => [...prev, ...event.payload.items]);
        });

        onCleanup(() => unlisten());
    });

    return (<Layout>
        <header class="mb-8">
            <h2 class="text-3xl mb-2 font-medium">Home</h2>
            <h3 class="text-secondary">Any new products found by your filters will be sent here.</h3>
        </header>
        <div class="grid grid-cols-3 gap-4">
            {items().map((item) => (
                <div id={item.id} class="bg-black">
                    <div>
                        <img class="w-10 h-10" src={item.photo.url} alt="Product picture" />
                    </div>
                    <div>
                        <a href={item.url} target="_blank" class="block w-fit text-primary text-base font-semibold mb-0.5">{item.title}</a>
                        <div>
                            {/* <span class="text-primary mr-1">{item.price.amount}€</span>
                            <span class="text-secondary">({item.total_item_price}€)</span> */}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </Layout>)
}
export default Home;
