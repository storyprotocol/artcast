// @ts-nocheck
export default function ErrorFrame({ error }: { error: string }) {
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
                padding: '5px 20px',
                gap: '10px',
                lineHeight: '25px',
            }}
        >
            <p>{error}</p>
        </div>


    )
}