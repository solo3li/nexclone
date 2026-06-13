import { pipeline, env } from "@huggingface/transformers";
env.allowLocalModels = false;
async function run() {
  const estimator = await pipeline('depth-estimation', 'Xenova/depth-anything-small-hf');
  // Just use a random URL
  const output = await estimator('https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/cats.jpg');
  console.log(Object.keys(output.depth));
  console.log("depth.data type:", output.depth.data.constructor.name);
  console.log("depth.channels:", output.depth.channels);
}
run().catch(console.error);
