
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set')
    }

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    })

    const body = await req.json()

    // Check if request is complete with required fields
    if (!body.prompt || !body.model) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: prompt and model are required" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log(`Generating image with model: ${body.model}, prompt: ${body.prompt}`)

    let modelId
    let modelConfig

    // Select the appropriate model based on the request
    switch (body.model) {
      case "sdxl":
        modelId = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
        modelConfig = {
          prompt: body.prompt,
          width: 1024,
          height: 1024,
          num_outputs: 1,
          num_inference_steps: 25,
        }
        break
      case "sdxl-turbo":
        modelId = "stability-ai/sdxl-turbo:3a04a2eeaa4c2ef2cad7cb7ee360b5da01388a1de219b273c81c39e02b3e9996"
        modelConfig = {
          prompt: body.prompt,
          num_outputs: 1,
          num_inference_steps: 1,
          guidance_scale: 0,
        }
        break
      case "flux":
      default:
        modelId = "black-forest-labs/flux-schnell:e4b7ebac5a94bf1875d572a94ceca594c12d8831e16e41b6e50ab5be53a8e8e2"
        modelConfig = {
          prompt: body.prompt,
          go_fast: true,
          megapixels: "1",
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 80,
          num_inference_steps: 4
        }
        break
    }

    // Run the model
    const output = await replicate.run(modelId, {
      input: modelConfig
    })

    console.log("Generation response:", output)
    return new Response(JSON.stringify({ output }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Error in generate-image function:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
