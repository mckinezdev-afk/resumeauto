const { OpenAI } = require('openai');
const fs = require('fs');
const markdownIt = require('markdown-it');
const puppeteer = require('puppeteer');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const answer = async (req, res) => {

    const { job, note } = req.body;
    const { name, email, phone, address, education, experience, skill, defaultnote,
        h1color, h2color, h3color, h4color, textcolor, bgcolor,textfont, headingfont, fontsize, lineheight
     } = req.user
    const { title, description } = job

    const sentence1 = `
     render the resume in markdown format, use appropriate markdown syntax for headings, lists, and emphasis.\n
    I want to make a resume to apply for the job titled "${title}".\n
    The job description is as follows: ${description}\n
    ${name ? `name is ` + name : ""}, \n
    ${email ? `email is ` + email : ""}, \n
    ${phone ? `phone is ` + phone : ""}, \n
    ${address ? `address is ` + address : ""}.\n
    ${education ? `education is ` + education : ""}.\n
    ${experience ? `experience is ` + experience : ""},\n
    ${skill ? `my default skills are ` + skill : ""},\n
    ${defaultnote ? `here is some more info about resume : ` + defaultnote : ""},\n
    Here is a note about resume : ${note}
   `;
    openai.responses.create({
        model: "gpt-5-nano",
        input: sentence1
    }).then(async (response) => {
        console.log('response for ' + req.user.name + " is generated!!!!")
        const mdText = response.output_text;
        const md = new markdownIt();
        const htmlContent = md.render(mdText);

        const html = `
        <html>
            <head>
                <style>
                    body { 
                        font-family: ${textfont ? textfont : 'Arial, sans-serif'}; 
                        color: ${textcolor ? textcolor : '#000000'};
                        padding: 25px; 
                        background-color: ${bgcolor ? bgcolor : '#ffffff'};
                        font-size: ${fontsize ? fontsize : '12px'}; 
                        line-height: ${lineheight ? lineheight : '1.5'}; 
                        margin: 0; 
                    }

                    h1 {
                        text-align: center; 
                        color: ${h1color ? h1color : '#1a1a1aff'}; 
                        margin-bottom: 20px;
                        page-break-after: avoid;
                        font-family: ${headingfont ? headingfont : 'Helvetica, sans-serif'};
                    }

                     h2 { 
                        color: ${h2color ? h2color : '#2e2e2eff'}; 
                        page-break-after: avoid; 
                        text-align :center;
                        font-family: ${headingfont ? headingfont : 'Helvetica, sans-serif'};
                    }
                    h3 { 
                        color: ${h3color ? h3color : '#4e4e4eff'}; 
                        page-break-after: avoid; 
                        text-align :center;
                        font-family: ${headingfont ? headingfont : 'Helvetica, sans-serif'};
                    }
                    h4 { 
                        color: ${h4color ? h4color : '#4e4e4eff'}; 
                        page-break-after: avoid; 
                        text-align :center;
                        font-family: ${headingfont ? headingfont : 'Helvetica, sans-serif'};
                    }

                    pre { 
                        background: #f4f4f4; 
                        padding: 10px; 
                        white-space: pre-wrap; 
                        word-wrap: break-word; 
                    }

                    /* Proper page break rules */
                    .page-break { 
                        page-break-before: always; 
                        break-before: page; 
                    }

                    /* Ensure padding is respected after page breaks */
                    @page { 
                        margin: 25px; 
                    }

                </style>
            </head>
            <body>${htmlContent}</body>
        </html>
        `;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: { top: '25mm', right: '25mm', bottom: '25mm', left: '25mm' },
            printBackground: true
        });
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="resume.pdf"`);
        res.send(pdfBuffer);

    }).catch((error) => {
        console.error('Error communicating with OpenAI:', error);
        res.status(500).json({ error: error.message });
    });
}


module.exports = {
    answer,
};