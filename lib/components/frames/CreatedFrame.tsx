import { Cast } from "@/lib/types/cast.interface";

// @ts-nocheck
export default function CreatedFrame({ previousCastInfo, castInfo, imageSrc }: { previousCastInfo: Cast, castInfo: Cast, imageSrc: string }) {
    return (
        <div
            style={{
                height: '100%',
                width: '100%',
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
            }}>by @{previousCastInfo.farcaster_id} and YOU!</p>
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
                <img src={imageSrc} width="400px" />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px',
                    lineHeight: '45px'
                }}>
                    <p style={{
                        fontSize: 40,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <span>Your creation is ready! Click</span>
                        <span>the button below to access your</span>
                        <span>share link. Share it as a cast</span>
                        <span>to keep your branch alive.</span>
                    </p>
                    {/* <p style={{
                        fontSize: 40,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <span style={{ fontWeight: 'bold' }}>Refresh for stats:</span>
                        <span>- # of derivatives: {castInfo.num_derivatives}</span>
                    </p> */}
                </div>
            </div>
        </div>


    )
}