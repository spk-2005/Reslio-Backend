const puppeteer = require('puppeteer');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

exports.exportResumePDF = async (req, res) => {
  try {
    const { resumeData, templateHTML } = req.body;

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(templateHTML, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=resume-${Date.now()}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export PDF',
    });
  }
};

exports.exportResumeImage = async (req, res) => {
  try {
    const { templateHTML } = req.body;

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600 });
    await page.setContent(templateHTML, { waitUntil: 'networkidle0' });

    const imageBuffer = await page.screenshot({
      fullPage: true,
      type: 'png',
    });

    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename=resume-${Date.now()}.png`);
    res.send(imageBuffer);
  } catch (error) {
    console.error('Image export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export image',
    });
  }
};

exports.exportResumeDOCX = async (req, res) => {
  try {
    const { resumeData } = req.body;
    const { personalInfo, summary, experience, education, skills } = resumeData;

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: personalInfo.fullName || 'Your Name',
            heading: HeadingLevel.TITLE,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `${personalInfo.email || ''} | ${personalInfo.phone || ''} | ${personalInfo.location || ''}`,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: 'SUMMARY',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            text: summary || 'Professional summary',
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: 'EXPERIENCE',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
          }),
          ...(experience || []).flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.position || '', bold: true }),
                new TextRun({ text: ` - ${exp.company || ''}` }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `${exp.startDate || ''} - ${exp.endDate || 'Present'}`,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: exp.description || '',
              spacing: { after: 200 },
            }),
          ]),
          new Paragraph({
            text: 'EDUCATION',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
          }),
          ...(education || []).flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({ text: `${edu.degree || ''} in ${edu.field || ''}`, bold: true }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `${edu.institution || ''} - ${edu.startDate || ''} to ${edu.endDate || ''}`,
              spacing: { after: 200 },
            }),
          ]),
          new Paragraph({
            text: 'SKILLS',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
          }),
          ...(skills || []).map(skillGroup => new Paragraph({
            text: `${skillGroup.category || ''}: ${(skillGroup.items || []).join(', ')}`,
            spacing: { after: 100 },
          })),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=resume-${Date.now()}.docx`);
    res.send(buffer);
  } catch (error) {
    console.error('DOCX export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export DOCX',
    });
  }
};

exports.exportPortfolioZIP = async (req, res) => {
  try {
    const { portfolioHTML, portfolioCSS, portfolioJS } = req.body;

    const archive = archiver('zip', { zlib: { level: 9 } });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=portfolio-${Date.now()}.zip`);

    archive.pipe(res);

    archive.append(portfolioHTML || '<html><body><h1>My Portfolio</h1></body></html>', { name: 'index.html' });
    archive.append(portfolioCSS || 'body { font-family: Arial, sans-serif; }', { name: 'styles.css' });
    archive.append(portfolioJS || '// Portfolio JavaScript', { name: 'script.js' });

    await archive.finalize();
  } catch (error) {
    console.error('ZIP export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export ZIP',
    });
  }
};
