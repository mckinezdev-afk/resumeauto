export async function postJSON(url, data) {
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.blob())
        .then(async (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = randomResumeName(data);
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(err => {
            let message = `Request failed with ${blob.status}`
            throw new Error(message)
        });
}

const randomResumeName = (data) => {    
    const nameObj = {
        'Nicholas Miller' : `${data.name} (${data.company}).pdf`,
        'Mckinley J Martinez' : `${data.company} - (${data.job.title}) resume.pdf`,
        'Bryan Lee' : `Bryan Lee (${data.company}).pdf`,
        'Brian Stewart' : `${data.name}- ${data.company} - (${data.job.title}) resume.pdf`,
        'Zachary Dean' : `${data.company} - (${data.job.title}) from ${data.name} resume.pdf`,
        'Ryan Wright' : `Ryan Wright (${data.company}).pdf`,
        "Brady Ross" : `(${data.company}) ${data.name}.pdf`
    }
    return nameObj[data.name] || `${data.name} - ${data.company} - (${data.job.title}) resume.pdf`;
}