import { Cast } from "@/lib/types/cast.interface";

// @ts-nocheck
export default function StartFrame({ castInfo, imageSrc }: { castInfo: Cast, imageSrc: string }) {
    return (
        <div
            style={{
                position: 'relative',
                height: '600px',
                width: '1146px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fff',
                padding: '5px 20px',
                gap: '10px',
                lineHeight: '25px'
            }}
        >
            <p style={{
                position: 'absolute',
                top: 0, right: 0,
                fontSize: 32,
                padding: '5px 20px'
            }}>
                Artcast #{castInfo.id}
            </p>
            <div style={{ display: 'flex' }}>
                <p style={{
                    marginBottom: '0px',
                    fontSize: 36,
                    fontWeight: 'bold',
                }}>{castInfo.name}</p>
            </div>
            <p style={{
                margin: '0',
                fontSize: 32,
            }}>by @{castInfo.farcaster_id}</p>
            <div style={{
                display: 'flex',
                gap: '20px'
            }}>
                <img src={imageSrc} width="400px" />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px 20px',
                    lineHeight: '45px',
                    gap: '20px'
                }}>
                    <p style={{
                        fontSize: 40,
                        display: 'flex',
                        flexDirection: 'column',
                        margin: 0
                    }}>
                        <span>This is a game where you do stuff.</span>
                        <span>Click 'Join' below.</span>
                    </p>
                </div>
            </div>
        </div>


    )
}