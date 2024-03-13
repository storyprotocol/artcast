// @ts-nocheck
export default function HomepageFrame() {
    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                gap: '10px'
            }}
        >
            <h1>Artcast</h1>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}>
                <span>Create & remix AI-generated images.</span>
            </div>
            <p style={{ fontSize: 32, margin: 0, marginBottom: '5px' }}>Registered on</p>
            <img src="https://i.imgur.com/AeNInz0.png" alt="story protocol logo" style={{ height: '20px' }} />

        </div>


    )
}