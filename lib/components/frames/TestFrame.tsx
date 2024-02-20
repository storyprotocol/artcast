import { Cast } from "@/lib/types/cast.interface";

// @ts-nocheck
export default function TestFrame({ castId }: { castId: number }) {
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
                Artcast #{castId}
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
                }}>Cast Name</p>
            </div>
            <p style={{
                margin: '0',
                fontSize: 32,
            }}>by an artist.</p>
            {/* <div style={{ display: 'flex', gap: '75px', marginTop: '10px', marginBottom: '5px' }}>
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
            </div> */}
            <div style={{
                display: 'flex',
                gap: '20px'
            }}>
                {/* <img src={castImage} width="325px" /> */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px 20px 5px 20px',
                    lineHeight: '45px',
                    fontSize: '40px',
                    gap: '20px'
                }}>
                    <p style={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: 0
                    }}>
                        <span>Keep this story alive by contributing</span>
                        <span>to this chain of creation.</span>
                    </p>
                </div>
            </div>
        </div>


    )
}