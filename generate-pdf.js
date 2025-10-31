import fs from 'fs';
import { marked } from 'marked';

// Read the markdown file
const markdown = fs.readFileSync('design-inventory.md', 'utf8');

// Convert markdown to HTML
const htmlContent = marked.parse(markdown);

// Create complete HTML document with proper styling
const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Family To-Do App - Design Inventory</title>
    <style>
        @page {
            margin: 2cm;
            size: A4;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
            font-size: 11pt;
        }
        
        h1 {
            color: #667eea;
            font-size: 28pt;
            margin-top: 0;
            margin-bottom: 0.5em;
            border-bottom: 3px solid #667eea;
            padding-bottom: 0.3em;
            page-break-after: avoid;
        }
        
        h2 {
            color: #764ba2;
            font-size: 20pt;
            margin-top: 2em;
            margin-bottom: 0.5em;
            border-bottom: 2px solid #764ba2;
            padding-bottom: 0.2em;
            page-break-after: avoid;
        }
        
        h3 {
            color: #333;
            font-size: 14pt;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            page-break-after: avoid;
        }
        
        h4 {
            color: #666;
            font-size: 12pt;
            margin-top: 1em;
            margin-bottom: 0.5em;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1.5em 0;
            page-break-inside: auto;
            font-size: 10pt;
        }
        
        tr {
            page-break-inside: avoid;
            page-break-after: auto;
        }
        
        thead {
            display: table-header-group;
        }
        
        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px 12px;
            text-align: left;
            font-weight: 600;
            border: 1px solid #5568d3;
        }
        
        td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
        }
        
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        
        code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 9pt;
            color: #e83e8c;
        }
        
        pre {
            background-color: #f4f4f4;
            padding: 12px;
            border-radius: 4px;
            overflow-x: auto;
            border-left: 4px solid #667eea;
            page-break-inside: avoid;
        }
        
        pre code {
            background: none;
            padding: 0;
            color: #333;
        }
        
        ul, ol {
            margin: 1em 0;
            padding-left: 2em;
        }
        
        li {
            margin: 0.5em 0;
        }
        
        p {
            margin: 1em 0;
        }
        
        strong {
            color: #667eea;
            font-weight: 600;
        }
        
        em {
            color: #764ba2;
            font-style: italic;
        }
        
        hr {
            border: none;
            border-top: 2px solid #ddd;
            margin: 2em 0;
        }
        
        a {
            color: #667eea;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        /* Print-specific styles */
        @media print {
            body {
                margin: 0;
                padding: 20px;
            }
            
            h1, h2, h3 {
                page-break-after: avoid;
            }
            
            table {
                page-break-inside: auto;
            }
            
            tr {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
${htmlContent}
<div style="margin-top: 3em; padding-top: 2em; border-top: 2px solid #ddd; text-align: center; color: #999; font-size: 9pt;">
    <p><em>Generated from design-inventory.md</em></p>
    <p>Family To-Do App Design Inventory • Version 1.0 • October 2025</p>
</div>
</body>
</html>
`;

// Write the HTML file
fs.writeFileSync('design-inventory.html', fullHTML);

console.log('✅ HTML file created: design-inventory.html');
console.log('📄 Open this file in your browser and use Print to PDF to create design-inventory.pdf');
console.log('   Chrome/Edge: File → Print → Save as PDF');
console.log('   Firefox: File → Print → Save to PDF');
console.log('   Safari: File → Export as PDF');
