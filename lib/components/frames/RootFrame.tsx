import { Cast } from "@/lib/types/cast.interface";

// @ts-nocheck
export default function RootFrame({ castInfo, imageSrc, type }: { castInfo: Cast, imageSrc: string, type: 'root' | 'derivative' | 'start' | 'created' }) {
    return (
        <div
            style={{
                position: 'relative',
                height: '600px',
                width: '1146px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fff',
                padding: '15px 20px',
                gap: '10px',
                lineHeight: '25px'
            }}
        >
            <p style={{
                position: 'absolute',
                top: 0, right: 0,
                fontSize: 32,
                padding: '15px 20px'
            }}>
                Artcast #{castInfo.id}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', bottom: 0, left: 0, position: 'absolute', padding: '15px 20px' }}>
                <p style={{ fontSize: 32, margin: 0, marginBottom: '5px' }}>Registered on</p>
                <img src="https://i.imgur.com/AeNInz0.png" alt="story protocol logo" style={{ height: '20px' }} />
            </div>
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
            }}>by @{type == 'created' ? castInfo.parent_cast!.farcaster_id + ' and YOU!' : castInfo.farcaster_id}</p>
            <div style={{ display: 'flex', gap: '75px', marginTop: '10px', marginBottom: '5px' }}>
                <div style={{
                    width: '30px',
                    height: '30px',
                    border: '2px solid black',
                    borderRadius: '100%',
                    backgroundColor: castInfo.branch_num > 0 ? 'lightgreen' : ''
                }}>
                </div>
                <div style={{
                    width: '30px',
                    height: '30px',
                    border: '2px solid black',
                    borderRadius: '100%',
                    backgroundColor: castInfo.branch_num > 1 ? 'lightgreen' : ''
                }}>
                </div>
                <div style={{
                    width: '30px',
                    height: '30px',
                    border: '2px solid black',
                    borderRadius: '100%',
                    backgroundColor: castInfo.branch_num > 2 ? 'lightgreen' : ''
                }}>
                </div>
                <div style={{
                    width: '30px',
                    height: '30px',
                    border: '2px solid black',
                    borderRadius: '100%',
                    backgroundColor: castInfo.branch_num > 3 ? 'lightgreen' : ''
                }}>
                </div>
                <div style={{
                    width: '30px',
                    height: '30px',
                    border: '2px solid black',
                    borderRadius: '100%',
                    backgroundColor: castInfo.branch_num > 4 ? 'lightgreen' : ''
                }}>
                </div>
                <div style={{
                    width: '30px',
                    height: '30px',
                    border: '2px solid black',
                    borderRadius: '100%',
                    backgroundColor: castInfo.branch_num > 5 ? 'lightgreen' : ''
                }}>
                </div>
                <div style={{
                    width: '30px',
                    height: '30px',
                    border: '2px solid black',
                    borderRadius: '100%',
                    backgroundColor: castInfo.branch_num > 6 ? 'lightgreen' : ''
                }}>
                </div>
                <div style={{
                    width: '30px',
                    height: '30px',
                    border: '2px solid black',
                    borderRadius: '100%',
                    backgroundColor: castInfo.branch_num > 7 ? 'lightgreen' : ''
                }}>
                </div>
                <div style={{
                    width: '30px',
                    height: '30px',
                    border: '2px solid black',
                    borderRadius: '100%',
                    backgroundColor: castInfo.branch_num > 8 ? 'lightgreen' : ''
                }}>
                </div>
                <div style={{
                    width: '30px',
                    height: '30px',
                    border: '2px solid black',
                    borderRadius: '100%',
                    backgroundColor: castInfo.branch_num > 9 ? 'lightgreen' : ''
                }}>
                </div>
            </div>
            <div style={{
                display: 'flex',
                gap: '20px'
            }}>
                {type != 'start' ? <img src={imageSrc} width="325px" />
                    : <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '325px', height: '325px', border: '1px solid grey' }}>
                        <span>Click 'Join' to</span>
                        <span>see the image!</span>
                    </div>}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px 20px 5px 20px',
                    lineHeight: '45px',
                    fontSize: '40px',
                    gap: '20px'
                }}>
                    {type == 'root' || type == 'derivative' ? <p style={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: 0
                    }}>
                        <span>Keep this story alive by contributing</span>
                        <span>to this chain of creation.</span>
                    </p> : type == 'start' ? <p style={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: 0,
                        gap: '25px'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>This Artcast was created</span>
                            <span>by @{castInfo.farcaster_id}.</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>Join to remix this story using</span>
                            <span>AI and register it on-chain</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>with <img src="https://i.imgur.com/AeNInz0.png" alt="story protocol logo" style={{ height: '25px' }} /></div>
                        </div>
                    </p> : <p style={{
                        fontSize: 40,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <span>Your creation is ready! Click</span>
                        <span>the button below to access your</span>
                        <span>share link. Share it as a cast</span>
                        <span>to keep your branch alive.</span>
                    </p>
                    }
                    {type == 'start' || type == 'created' ? null :
                        <p style={{
                            display: 'flex',
                            flexDirection: 'column',
                            margin: 0
                        }}>
                            <span style={{ fontWeight: 'bold' }}>Refresh for stats:</span>
                            <span>- direct remixes: <span style={{ backgroundColor: 'lightgrey', padding: '5px', borderRadius: '5px' }}>{castInfo.num_derivatives}</span></span>
                            <span>- total remixes: <span style={{ backgroundColor: 'lightgrey', padding: '5px', borderRadius: '5px' }}>{castInfo.num_total_derivatives}</span></span>
                        </p>
                    }
                </div>
            </div>
        </div>


    )
}