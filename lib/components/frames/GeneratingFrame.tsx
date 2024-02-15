// @ts-nocheck
export default function GeneratingFrame({ castId }: { castId: number }) {
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
            <p>Remixing Artcast #{castId}...</p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Please wait ~10 seconds and</span>
                <span>then press the 'Refresh' button.</span>
            </div>
        </div>


    )
}