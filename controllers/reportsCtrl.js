const asyncHandler = require('express-async-handler');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const Budgets = require('../models/budget');
const fs = require('fs');
const path = require('path');
const Transactions = require('../models/transactions');
const validateMongodbId = require('../utils/validateMongodbId');
const ExcelJS = require('exceljs');
const regression = require('regression');

const overviewReports = asyncHandler(async (req, res) => {
    try {
        // Fetch budget data
        const budgets = await Budgets.find({ fyi: "2024-25" }).populate("institution");
        if (!budgets || budgets.length === 0) {
            throw new Error("No budgets found for FYI 2024-25");
        }
        const totalBudget = budgets.reduce((sum, budget) => sum + parseFloat(budget.amount || 0), 0);

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();

        const imagePath = path.join(__dirname, '../public/Govt.png');

        const imageBytes = fs.readFileSync(imagePath);
        const image = await pdfDoc.embedPng(imageBytes);

        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();
        const { width: imageWidth, height: imageHeight } = image.scale(0.3); // Scale image as needed

        // Calculate centered position
        const x = (pageWidth - imageWidth) / 2;
        const y = (pageHeight - imageHeight) - 20; // Position at the top

        // Draw the image at the calculated position
        page.drawImage(image, { x, y, width: imageWidth, height: imageHeight });

        // Add content to the PDF
        const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const text = budgets[0].institution?.institutionName || "N/A";
        const fontSize = 16;

        // Measure text width
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        // Draw centered text
        page.drawText(text, {
            x: (width - textWidth) / 2,
            y: height - 120,
            size: fontSize,
            font,
        });

        page.drawLine({
            start: { x: 0, y: height - 130 },
            end: { x: width, y: height - 130 },
            thickness: 1, // Optional: Line width
            // color: rgb(red, green, blue), // Optional: Line color
            opacity: 1, // Optional: Transparency (0 to 1)
        });

        const title = budgets[0]?.fyi + " Budget overview";
        const titleWidth = font.widthOfTextAtSize(title, fontSize);

        page.drawText(title, {
            x: (width - titleWidth) / 2,
            y: height - 160,
            size: fontSize,
            font: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
        });



        page.drawText(`Total Budget: $${totalBudget}`, { x: 50, y: height - 100, size: 15 });

        budgets.forEach((budget, index) => {
            page.drawText(`${index + 1}. Description: ${budget.description}, Amount: $${budget.amount}`, {
                x: 50,
                y: height - 150 - index * 20,
                size: 12,
            });
        });

        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync('test-pdf.pdf', pdfBytes);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="budget-overview.pdf"');
        res.send(pdfBytes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating PDF');
    }
}
)


function wrapText(text, font, fontSize, maxWidth) {
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const lineWidth = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);

        if (lineWidth <= maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

const transactionsReports = asyncHandler(async (req, res) => {
    try {
        const { startDate, endDate, inst, docType } = req.body;


        inst && validateMongodbId(inst);
        const { fullNames, email, mobile, position, institution } = req.user;

        const query = {
            ...(startDate && endDate && { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } }),
            ...(inst && { institution: inst }),
        };
        // Fetch budget data
        const transactions = await Transactions.find(query)
            .populate("budget")
            .populate("institution")
            .sort({ createdAt: 1 });

        if (!transactions || transactions.length === 0) {
            throw new Error("No transactions found!");
        }
        const totalIncome = transactions.filter((budget) => budget.type.toLowerCase() === "income").reduce((sum, budget) => sum + parseFloat(budget.amount || 0), 0);
        const totalExpense = transactions.filter((budget) => budget.type.toLowerCase() === "expense").reduce((sum, budget) => sum + parseFloat(budget.amount || 0), 0);

        if (docType?.toLowerCase() === 'pdf') {


            // Create a new PDF document
            const pdfDoc = await PDFDocument.create();
            const pageHeight = 792; // Default page height (A4 size in points)
            const pageWidth = 612; // Default page width (A4 size in points)
            const lineHeight = 20; // Height for each record line
            const margin = 20; // Page margin

            let y = pageHeight - margin;
            // Add a new page
            let page = pdfDoc.addPage([pageWidth, pageHeight]); // P
            const { width, height } = page.getSize();

            const imagePath = path.join(__dirname, '../public/Govt.png');

            const imageBytes = fs.readFileSync(imagePath);
            const image = await pdfDoc.embedPng(imageBytes);


            const { width: imageWidth, height: imageHeight } = image.scale(0.2); // Scale image as needed

            // Calculate centered position
            const x = (pageWidth - imageWidth) / 2;

            // Draw the image at the calculated position
            page.drawImage(image, { x, y: y - 30, width: imageWidth, height: imageHeight });

            // Add content to the PDF
            const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            const text = transactions[0].institution?.institutionName || "N/A";
            const fontSize = 16;

            // Measure text width
            const textWidth = font.widthOfTextAtSize(text, fontSize);

            // Draw centered text
            page.drawText(text, {
                x: (width - textWidth) / 2,
                y: y - 40,
                size: fontSize,
                font,
            });

            page.drawLine({
                start: { x: 0, y: y - 50 },
                end: { x: width, y: y - 50 },
                thickness: 1, // Optional: Line width
                // color: rgb(red, green, blue), // Optional: Line color
                opacity: 1, // Optional: Transparency (0 to 1)
            });

            const title = startDate && endDate ? "Transaction history from " + startDate + " to " + endDate : "Transaction history";
            const titleWidth = font.widthOfTextAtSize(title, fontSize);

            page.drawText(title, {
                x: (width - titleWidth) / 2,
                y: y - 70,
                size: fontSize,
                font: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
            });

            for (let i = 0; i < transactions.length; i++) {
                const budget = transactions[i];

                // Draw table headers if it's the first page or a new page
                if (i === 0 || y < margin + 3 * lineHeight) {
                    // Add a new page if not the first iteration
                    if (i !== 0) {
                        page = pdfDoc.addPage([pageWidth, pageHeight]);
                        y = pageHeight - margin;
                    }

                    // Draw table headers
                    page.drawText("Transaction", { x: margin, y: y - 90, size: 12, font });
                    page.drawText("Institution", { x: margin + 200, y: y - 90, size: 12, font });
                    page.drawText("FYI", { x: margin + 300, y: y - 90, size: 12, font });
                    page.drawText("Type", { x: margin + 350, y: y - 90, size: 12, font });
                    page.drawText("Amount", { x: margin + 400, y: y - 90, size: 12, font });
                    page.drawText("Date", { x: margin + 480, y: y - 90, size: 12, font });

                    page.drawLine({
                        start: { x: margin, y: y - 95 },
                        end: { x: pageWidth - margin, y: y - 95 },
                        thickness: 0.1,
                    });

                    y -= lineHeight; // Adjust `y` for the next row
                }


                const categoryLines = wrapText(budget?.category || "N/A", font, 10, 200);
                const institutionLines = wrapText(budget?.institution?.institutionName || "N/A", font, fontSize, 150);
                const fyiLines = wrapText(budget?.budget?.fyi || "N/A", font, 10, 100);
                const amountLines = wrapText(budget?.amount || "N/A", font, 10, 100);
                const typeLines = wrapText(budget?.type || "N/A", font, 10, 200);
                const dateLines = wrapText(`${new Date(budget?.createdAt).toLocaleDateString()}` || "N/A", font, 10, 100);
                // Calculate the number of lines required for this row
                const maxLines = Math.max(dateLines.length, typeLines.length, categoryLines.length, institutionLines.length, fyiLines.length, amountLines.length);

                for (let j = 0; j < maxLines; j++) {
                    const institutionText = institutionLines[j] || "";
                    const fyiText = fyiLines[j] || "";
                    const amountText = amountLines[j] || "";
                    const categoryText = categoryLines[j] || "";
                    const typeText = typeLines[j] || "";
                    const dateText = dateLines[j] || "";
                    // Draw the wrapped text for each cell
                    page.drawText(categoryText, { x: margin, y: y - 90, size: 10, font });
                    page.drawText(institutionText, { x: margin + 200, y: y - 90, size: 10, font });
                    page.drawText(fyiText, { x: margin + 300, y: y - 90, size: 10, font });
                    page.drawText(typeText, { x: margin + 350, y: y - 90, size: 10, font });
                    page.drawText(typeText.toLowerCase() === "expense" ? "-" + amountText : "+" + amountText, { x: margin + 400, y: y - 90, size: 10, font, color: typeText.toLowerCase() === "expense" ? rgb(220 / 255, 38 / 255, 38 / 255) : rgb(18 / 255, 163 / 255, 71 / 255) });
                    page.drawText(`${dateText}` || "N/A", { x: margin + 480, y: y - 90, size: 10, font });

                    y -= lineHeight; // Move to the next line

                    // Check if we need a new page
                    if (y < (margin + lineHeight) * 2) {
                        page = pdfDoc.addPage([pageWidth, pageHeight]);
                        y = (pageHeight - margin) + 80;

                        // Draw table headers
                        page.drawText("Transaction", { x: margin, y: y - 90, size: 12, font });
                        page.drawText("Institution", { x: margin + 200, y: y - 90, size: 12, font });
                        page.drawText("FYI", { x: margin + 300, y: y - 90, size: 12, font });
                        page.drawText("Type", { x: margin + 350, y: y - 90, size: 12, font });
                        page.drawText("Amount", { x: margin + 400, y: y - 90, size: 12, font });
                        page.drawText("Date", { x: margin + 480, y: y - 90, size: 12, font });

                        page.drawLine({
                            start: { x: margin, y: y - 95 },
                            end: { x: pageWidth - margin, y: y - 95 },
                            thickness: 0.1,
                        });
                        y -= lineHeight; // Adjust `y` for rows
                    }
                }
            }

            page.drawText("Total incomes= " + totalIncome.toFixed(2) + " Frw", { x: margin, y: y - 100, size: 16, font });
            page.drawText("Total expenses= " + totalExpense.toFixed(2) + " Frw", { x: margin + 300, y: y - 100, size: 16, font });

            page.drawText("Generated by:", { x: margin, y: y - 120, size: 16, font });
            page.drawText(fullNames || "N/A", { x: margin, y: y - 140, size: 10, font });
            page.drawText(email || "N/A", { x: margin, y: y - 160, size: 10, font });
            page.drawText(mobile || "N/A", { x: margin, y: y - 180, size: 10, font });
            page.drawText(position || "N/A", { x: margin, y: y - 200, size: 10, font });
            page.drawText(`${new Date()}`, { x: margin, y: y - 220, size: 10, font });



            // Save the PDF
            const pdfBytes = await pdfDoc.save();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="transactions_history.pdf"');
            res.end(pdfBytes);
        } else {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Transactions Report");

            // Add headers
            worksheet.columns = [
                { header: "Transaction", key: "category", width: 20 },
                { header: "Institution", key: "institution", width: 25 },
                { header: "FYI", key: "fyi", width: 10 },
                { header: "Type", key: "type", width: 15 },
                { header: "Amount", key: "amount", width: 15 },
                { header: "Date", key: "createdAt", width: 20 },
            ];

            // Add data rows
            transactions.forEach((budget) => {
                worksheet.addRow({
                    category: budget.category || "N/A",
                    institution: budget.institution?.institutionName || "N/A",
                    fyi: budget.budget?.fyi || "N/A",
                    type: budget.type || "N/A",
                    amount: budget.type.toLowerCase() === "expense" ? `-${budget.amount}` : `+${budget.amount}`,
                    createdAt: new Date(budget.createdAt).toLocaleDateString(),
                });
            });

            // Add totals at the end
            worksheet.addRow({}); // Empty row for spacing
            worksheet.addRow({ category: "Total Income:", amount: totalIncome.toFixed(2) });
            worksheet.addRow({ category: "Total Expense:", amount: totalExpense.toFixed(2) });

            // Add generated by info
            worksheet.addRow({}); // Empty row for spacing
            worksheet.addRow({ category: "Generated By:" });
            worksheet.addRow({ category: "Name:", institution: fullNames || "N/A" });
            worksheet.addRow({ category: "Email:", institution: email || "N/A" });
            worksheet.addRow({ category: "Mobile:", institution: mobile || "N/A" });
            worksheet.addRow({ category: "Position:", institution: position || "N/A" });
            worksheet.addRow({ category: "Date:", institution: new Date().toLocaleString() });

            // Set response headers and send the Excel file
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename="transactions_history.xlsx"');

            await workbook.xlsx.write(res);
            res.end();

        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating report');
    }
}
)

const forecast = asyncHandler(async (req, res) => {
    try {
        const { predictYears = 6 } = req.query;

        // Fetch transactions with their corresponding budget data
        const transactions = await Transactions.find().populate("budget");

        if (transactions.length < 1) {
            return res.status(400).json({
                error: "Insufficient data. Please provide transactions with associated budgets.",
            });
        }

        // Group transactions by FYI from budget
        const groupedData = {};
        transactions.forEach((transaction) => {
            const budget = transaction.budget;
            if (!budget || !budget.fyi) return; // Skip if no budget or FYI

            const fyi = budget.fyi;

            // Initialize FYI if not already present
            if (!groupedData[fyi]) {
                groupedData[fyi] = { expenses: 0, incomes: 0 };
            }            

            // Sum up expenses and incomes
            if (transaction.type.toLowerCase() === "expense") {
                groupedData[fyi].expenses += parseFloat(transaction.amount);
            } else if (transaction.type.toLowerCase() === "income") {
                groupedData[fyi].incomes += parseFloat(transaction.amount)  ;
            }
        });

        // Prepare historical data
        const sortedFYIs = Object.keys(groupedData).sort(); // Sort FYIs for chronological order
        const historicalData = sortedFYIs.map((fyi, index) => ({
            fyi,
            index,
            ...groupedData[fyi],
        }));

        // Apply linear regression on expenses
        const regressionData = historicalData.map((data) => [data.index, data.expenses]);
        const result = regression.linear(regressionData);
        const { equation } = result;

        // Apply linear regression on Incomes
        const regressionData2 = historicalData.map((data) => [data.index, data.incomes]);
        const result2 = regression.linear(regressionData2);
        const { equation: equation2 } = result2;



        // Predict next financial years
        const lastFYI = sortedFYIs[sortedFYIs.length - 1];
        const [lastStartYear] = lastFYI.split('-').map(Number);
        const predictions = [];
        for (let i = 1; i <= predictYears; i++) {
            const x = historicalData.length + i - 1; // Extend index for regression
            const predictedExpense = equation[0] * x + equation[1];
            const predictedIncome = equation2[0] * x + equation2[1];

            const nextStartYear = lastStartYear + i;
            const nextEndYear = nextStartYear + 1;
            predictions.push({
                fyi: `${nextStartYear}-${nextEndYear.toString().slice(-2)}`, // Format: "2026-27"
                predictedExpense,
                predictedIncome
            });
        }

        // Respond with historical and forecasted data
        res.status(200).json({
            historical: historicalData,
            forecast: predictions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate forecast" });
    }
});





module.exports = {
    overviewReports, transactionsReports, forecast
}