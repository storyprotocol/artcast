'use server';
import { supabaseClient } from "../supabase/supabaseClient";

export async function registerOnStory(farcasterName: string, castName: string, castPrompt: string | null, castId: number, imageUrl: string) {
    const myHeaders = new Headers();
    myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "registrarId": farcasterName,
        "artworkName": `Artcast ${castId}: ${castName}`,
        "description": castPrompt ? castPrompt : 'A new Artcast.',
        "authors": [
            {
                "name": farcasterName,
                "percentage": 100
            }
        ],
        "licenseParam": {
            "isCommercial": true
        },
        "mediaUrl": imageUrl,
        "origin": "Artcast",
        "originUrl": `artcast.ai/cast/${castId}`,
        "tags": [
            {
                "key": "AI Assisted",
                "value": "True"
            }
        ]
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw
    };

    console.log('registering on sp alpha...')

    try {
        console.log("calling to magma")
        const response2 = await fetch(`https://fnames.farcaster.xyz/transfers?fid=${1}`);
        const result2 = await response2.json();
        const farcaster_name = result2.transfers[0].username;
        console.log(farcaster_name);
        const response = await fetch("https://magma.demo.storyprotocol.net/registration/artwork", requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log("anything here...")
        console.log(response);
        const result = await response.json();
        console.log(result)
        const story_explorer_url = result.storyExplorerUrl
        const { data, error } = await supabaseClient.from('cast_datas').update({
            story_explorer_url
        }).eq('id', castId);
    } catch (e) {
        console.log(e);
    }
};