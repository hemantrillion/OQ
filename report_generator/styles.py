import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def init_document():
    doc = docx.Document()
    section = doc.sections[0]
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin = Inches(1.25)
    section.right_margin = Inches(1.0)
    section.page_width = Inches(8.27)  # A4 width
    section.page_height = Inches(11.69) # A4 height

    # Base Normal Style
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = RGBColor(15, 23, 42) # Dark Slate #0F172A
    normal_style.paragraph_format.line_spacing = 1.5
    normal_style.paragraph_format.space_after = Pt(6)
    normal_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    # Add custom page number to footer
    footer = section.footer
    f_p = footer.paragraphs[0]
    f_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    f_run = f_p.add_run()
    f_run.font.name = 'Times New Roman'
    f_run.font.size = Pt(10)
    f_run.font.color.rgb = RGBColor(100, 116, 139)
    
    # Add page number XML
    fldSimple = OxmlElement('w:fldSimple')
    fldSimple.set(qn('w:instr'), 'PAGE')
    f_p._p.append(fldSimple)

    return doc

def set_cell_background(cell, color_hex):
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}>'
                      f'<w:top w:w="{top}" w:type="dxa"/>'
                      f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
                      f'<w:left w:w="{left}" w:type="dxa"/>'
                      f'<w:right w:w="{right}" w:type="dxa"/>'
                      f'</w:tcMar>')
    tcPr.append(tcMar)

def set_cell_borders(cell, top=None, bottom=None, left=None, right=None):
    tcPr = cell._tc.get_or_add_tcPr()
    borders_xml = f'<w:tcBorders {nsdecls("w")}>'
    if top:
        borders_xml += f'<w:top w:val="{top.get("val", "single")}" w:sz="{top.get("sz", "4")}" w:space="0" w:color="{top.get("color", "CBD5E1")}"/>'
    else:
        borders_xml += '<w:top w:val="none"/>'
    if bottom:
        borders_xml += f'<w:bottom w:val="{bottom.get("val", "single")}" w:sz="{bottom.get("sz", "4")}" w:space="0" w:color="{bottom.get("color", "CBD5E1")}"/>'
    else:
        borders_xml += '<w:bottom w:val="none"/>'
    if left:
        borders_xml += f'<w:left w:val="{left.get("val", "single")}" w:sz="{left.get("sz", "4")}" w:space="0" w:color="{left.get("color", "CBD5E1")}"/>'
    else:
        borders_xml += '<w:left w:val="none"/>'
    if right:
        borders_xml += f'<w:right w:val="{right.get("val", "single")}" w:sz="{right.get("sz", "4")}" w:space="0" w:color="{right.get("color", "CBD5E1")}"/>'
    else:
        borders_xml += '<w:right w:val="none"/>'
    borders_xml += '</w:tcBorders>'
    tcPr.append(parse_xml(borders_xml))

def add_chapter_title(doc, chapter_num, title):
    doc.add_page_break()
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(14)
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
    
    r_sub = p.add_run(f"CHAPTER {chapter_num}\n")
    r_sub.font.name = 'Times New Roman'
    r_sub.font.size = Pt(14)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(79, 70, 229) # Indigo #4F46E5
    
    r_title = p.add_run(title.upper())
    r_title.font.name = 'Times New Roman'
    r_title.font.size = Pt(18)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(15, 23, 42) # Slate #0F172A

    # Add divider line
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_before = Pt(0)
    p_div.paragraph_format.space_after = Pt(12)
    p_div_border = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="12" w:space="1" w:color="4F46E5"/></w:pBdr>')
    p_div._p.get_or_add_pPr().append(p_div_border)

def add_heading_2(doc, title):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(title)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(30, 41, 59) # Slate 800

def add_heading_3(doc, title):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(title)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = RGBColor(51, 65, 85) # Slate 700

def add_paragraph(doc, text, bold=False, italic=False, space_after=6):
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r = p.add_run(text)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = bold
    r.font.italic = italic
    r.font.color.rgb = RGBColor(15, 23, 42)
    return p

def add_bullet(doc, text, bold_prefix="", level=0):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.line_spacing = 1.35
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.left_indent = Inches(0.25 * (level + 1))
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Times New Roman'
        r_pre.font.size = Pt(12)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(15, 23, 42)
    r = p.add_run(text)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.color.rgb = RGBColor(30, 41, 59)

def add_callout(doc, title, text):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.rows[0].cells[0]
    cell.width = Inches(6.0)
    
    set_cell_background(cell, "F8FAFC") # Soft Slate
    set_cell_margins(cell, top=140, bottom=140, left=200, right=160)
    set_cell_borders(cell, left={"val": "single", "sz": "24", "color": "3B82F6"}) # 3pt blue left border
    
    p = cell.paragraphs[0]
    p.paragraph_format.line_spacing = 1.25
    p.paragraph_format.space_after = Pt(4)
    r_title = p.add_run(f"PLAIN-LANGUAGE INTUITION (5th-Grade Concept / Rule 1.1): {title}\n")
    r_title.font.name = 'Times New Roman'
    r_title.font.size = Pt(10.5)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(29, 78, 216) # Blue 700
    
    r_text = p.add_run(text)
    r_text.font.name = 'Times New Roman'
    r_text.font.size = Pt(10.5)
    r_text.font.italic = True
    r_text.font.color.rgb = RGBColor(51, 65, 85)
    
    # spacing paragraph after table
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(4)
    p_sp.paragraph_format.space_after = Pt(4)

def add_diagram(doc, diagram_text, caption):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.rows[0].cells[0]
    cell.width = Inches(6.0)
    
    set_cell_background(cell, "F1F5F9") # Slate 100
    set_cell_margins(cell, top=140, bottom=140, left=160, right=160)
    set_cell_borders(cell, 
                     top={"val": "single", "sz": "6", "color": "CBD5E1"},
                     bottom={"val": "single", "sz": "6", "color": "CBD5E1"},
                     left={"val": "single", "sz": "6", "color": "CBD5E1"},
                     right={"val": "single", "sz": "6", "color": "CBD5E1"})
    
    p = cell.paragraphs[0]
    p.paragraph_format.line_spacing = 1.0
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(diagram_text.strip())
    r.font.name = 'Consolas'
    r.font.size = Pt(8.5)
    r.font.color.rgb = RGBColor(15, 23, 42)
    
    # Caption
    p_cap = doc.add_paragraph()
    p_cap.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(4)
    p_cap.paragraph_format.space_after = Pt(10)
    r_cap = p_cap.add_run(caption)
    r_cap.font.name = 'Times New Roman'
    r_cap.font.size = Pt(10)
    r_cap.font.bold = True
    r_cap.font.italic = True
    r_cap.font.color.rgb = RGBColor(71, 85, 105)

def add_table(doc, headers, rows, caption, col_widths=None):
    # Caption first
    p_cap = doc.add_paragraph()
    p_cap.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(8)
    p_cap.paragraph_format.space_after = Pt(4)
    r_cap = p_cap.add_run(caption)
    r_cap.font.name = 'Times New Roman'
    r_cap.font.size = Pt(10.5)
    r_cap.font.bold = True
    r_cap.font.color.rgb = RGBColor(30, 41, 59)

    table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    # Header row
    hdr_cells = table.rows[0].cells
    for i, header_text in enumerate(headers):
        hdr_cells[i].text = header_text
        set_cell_background(hdr_cells[i], "1E293B") # Dark slate
        set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
        set_cell_borders(hdr_cells[i],
                         top={"val": "single", "sz": "6", "color": "0F172A"},
                         bottom={"val": "single", "sz": "12", "color": "4F46E5"},
                         left={"val": "single", "sz": "4", "color": "334155"},
                         right={"val": "single", "sz": "4", "color": "334155"})
        p = hdr_cells[i].paragraphs[0]
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(0)
        p.runs[0].font.name = 'Times New Roman'
        p.runs[0].font.size = Pt(10)
        p.runs[0].font.bold = True
        p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    # Data rows
    for r_idx, row_data in enumerate(rows):
        row_cells = table.rows[r_idx + 1].cells
        bg_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            row_cells[c_idx].text = str(val)
            set_cell_background(row_cells[c_idx], bg_color)
            set_cell_margins(row_cells[c_idx], top=80, bottom=80, left=100, right=100)
            set_cell_borders(row_cells[c_idx],
                             top={"val": "single", "sz": "4", "color": "E2E8F0"},
                             bottom={"val": "single", "sz": "4", "color": "E2E8F0"},
                             left={"val": "single", "sz": "4", "color": "E2E8F0"},
                             right={"val": "single", "sz": "4", "color": "E2E8F0"})
            p = row_cells[c_idx].paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(0)
            if len(p.runs) > 0:
                p.runs[0].font.name = 'Times New Roman'
                p.runs[0].font.size = Pt(9.5)
                p.runs[0].font.color.rgb = RGBColor(30, 41, 59)

    # Set column widths if provided
    if col_widths:
        for row in table.rows:
            for idx, width in enumerate(col_widths):
                if idx < len(row.cells):
                    row.cells[idx].width = Inches(width)

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(4)
    p_sp.paragraph_format.space_after = Pt(8)

def add_code_snippet(doc, code_text, caption, file_path=None, line_range=None):
    table = doc.add_table(rows=2, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    # Title row (File path + line numbers)
    cell_hdr = table.rows[0].cells[0]
    cell_hdr.width = Inches(6.0)
    set_cell_background(cell_hdr, "334155") # Slate 700
    set_cell_margins(cell_hdr, top=60, bottom=60, left=120, right=120)
    set_cell_borders(cell_hdr, 
                     top={"val": "single", "sz": "6", "color": "1E293B"},
                     bottom={"val": "single", "sz": "6", "color": "1E293B"},
                     left={"val": "single", "sz": "6", "color": "1E293B"},
                     right={"val": "single", "sz": "6", "color": "1E293B"})
    p_hdr = cell_hdr.paragraphs[0]
    p_hdr.paragraph_format.line_spacing = 1.0
    p_hdr.paragraph_format.space_after = Pt(0)
    hdr_label = f"SOURCE FILE: {file_path}" if file_path else "SOURCE CODE IMPLEMENTATION"
    if line_range:
        hdr_label += f" | LINES: {line_range}"
    r_hdr = p_hdr.add_run(hdr_label)
    r_hdr.font.name = 'Consolas'
    r_hdr.font.size = Pt(8.5)
    r_hdr.font.bold = True
    r_hdr.font.color.rgb = RGBColor(241, 245, 249)

    # Code content row
    cell_code = table.rows[1].cells[0]
    cell_code.width = Inches(6.0)
    set_cell_background(cell_code, "F8FAFC") # Soft gray
    set_cell_margins(cell_code, top=100, bottom=100, left=120, right=120)
    set_cell_borders(cell_code, 
                     top={"val": "none"},
                     bottom={"val": "single", "sz": "6", "color": "CBD5E1"},
                     left={"val": "single", "sz": "6", "color": "CBD5E1"},
                     right={"val": "single", "sz": "6", "color": "CBD5E1"})
    p_code = cell_code.paragraphs[0]
    p_code.paragraph_format.line_spacing = 1.0
    p_code.paragraph_format.space_after = Pt(0)
    r_code = p_code.add_run(code_text.strip())
    r_code.font.name = 'Consolas'
    r_code.font.size = Pt(8.0)
    r_code.font.color.rgb = RGBColor(15, 23, 42)

    # Caption
    p_cap = doc.add_paragraph()
    p_cap.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(4)
    p_cap.paragraph_format.space_after = Pt(10)
    r_cap = p_cap.add_run(caption)
    r_cap.font.name = 'Times New Roman'
    r_cap.font.size = Pt(10)
    r_cap.font.bold = True
    r_cap.font.italic = True
    r_cap.font.color.rgb = RGBColor(71, 85, 105)
