import React from "react";

import { Configuration, OpenAIApi } from "openai";

export const configuration = new Configuration({
  apiKey: "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",
});

export const openai = new OpenAIApi(configuration);

export const openai_interact = async (prompt, type) => { 
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            max_tokens: 3000
        });
        console.log(completion.data.choices[0])
      
        return completion.data.choices[0].text;


    } catch (error) {
        console.log(error);
    }
}

