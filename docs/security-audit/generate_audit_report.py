import os
import sys
import html
import matplotlib.pyplot as plt

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

# ==============================================================================
# CONFIGURAÇÃO DE CORES & PALETA OFICIAL EXIGIDA
# ==============================================================================
PALETTE = {
    'critica': '#B91C1C',      # Vermelho escuro (#B91C1C)
    'alta': '#EA580C',         # Laranja (#EA580C)
    'media': '#D97706',        # Âmbar (#D97706)
    'baixa': '#2563EB',        # Azul (#2563EB)
    'forte': '#059669',        # Esmeralda (#059669)
    'primary': '#00185F',      # Azul Marinho Institucional
    'secondary': '#BC0100',    # Vermelho Institucional
    'dark': '#0F172A',         # Slate 900
    'text': '#1E293B',         # Slate 800
    'light_bg': '#F8FAFC',     # Slate 50
    'border': '#CBD5E1',      # Slate 300
    'card_bg': '#F1F5F9',     # Slate 100
}

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_PATH = os.path.join(OUTPUT_DIR, "relatorio-auditoria-seguranca.pdf")
CHARTS_DIR = os.path.join(OUTPUT_DIR, "charts")
os.makedirs(CHARTS_DIR, exist_ok=True)

# ==============================================================================
# 1. GERAÇÃO DOS GRÁFICOS (MATPLOTLIB)
# ==============================================================================
def generate_charts():
    plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
    plt.rcParams['axes.edgecolor'] = '#CBD5E1'
    plt.rcParams['text.color'] = '#1E293B'

    # --- Gráfico 1: Rosca por Severidade ---
    labels_sev = ['Crítica (2)', 'Alta (3)', 'Média (2)', 'Baixa (1)']
    counts_sev = [2, 3, 2, 1]
    colors_sev = [PALETTE['critica'], PALETTE['alta'], PALETTE['media'], PALETTE['baixa']]

    fig, ax = plt.subplots(figsize=(4.2, 3.4), subplot_kw=dict(aspect="equal"))
    wedges, texts, autotexts = ax.pie(
        counts_sev,
        labels=labels_sev,
        colors=colors_sev,
        autopct='%1.0f%%',
        startangle=140,
        pctdistance=0.75,
        wedgeprops=dict(width=0.45, edgecolor='white', linewidth=2),
        textprops=dict(color='#0F172A', fontsize=8.5, weight='bold')
    )
    for at in autotexts:
        at.set_color('white')
        at.set_fontsize(9.5)
        at.set_weight('bold')

    ax.set_title("Achados por Severidade", fontsize=11, fontweight='bold', color=PALETTE['primary'], pad=10)
    chart1_path = os.path.join(CHARTS_DIR, "rosca_severidade.png")
    plt.tight_layout()
    plt.savefig(chart1_path, dpi=300, transparent=False, facecolor='#FFFFFF')
    plt.close()

    # --- Gráfico 2: Barras por Categoria ---
    categorias = [
        'Banco sem Tranca\n(RLS / Tenant)',
        'Permissão no\nNavegador',
        'IDOR\n(Ref. Objeto)',
        'Chaves Expostas\n& Gestão Segredos',
        'Inputs / XSS\n& CSP'
    ]
    counts_cat = [3, 2, 2, 2, 1]
    colors_cat = [PALETTE['critica'], PALETTE['alta'], PALETTE['media'], PALETTE['baixa'], PALETTE['critica']]

    fig, ax = plt.subplots(figsize=(5.8, 3.4))
    bars = ax.barh(categorias, counts_cat, color=colors_cat, height=0.55, edgecolor='none')
    ax.invert_yaxis()

    for bar in bars:
        w = bar.get_width()
        ax.text(w + 0.08, bar.get_y() + bar.get_height()/2, f'{int(w)}',
                ha='left', va='center', fontsize=9, fontweight='bold', color='#1E293B')

    ax.set_xlim(0, 3.8)
    ax.set_title("Vulnerabilidades por Categoria", fontsize=11, fontweight='bold', color=PALETTE['primary'], pad=10)
    ax.grid(axis='x', linestyle='--', alpha=0.3, color='#94A3B8')
    ax.tick_params(axis='both', which='major', labelsize=8)
    for spine in ax.spines.values():
        spine.set_visible(False)

    chart2_path = os.path.join(CHARTS_DIR, "barras_categoria.png")
    plt.tight_layout()
    plt.savefig(chart2_path, dpi=300, transparent=False, facecolor='#FFFFFF')
    plt.close()

    return chart1_path, chart2_path

# ==============================================================================
# 2. CANVAS COM CABEÇALHO, RODAPÉ E NUMERAÇÃO DINÂMICA
# ==============================================================================
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        # Ignora decorações na Capa
        if self._pageNumber == 1:
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor('#64748B'))

        # Cabeçalho Superior
        self.drawString(2 * cm, 28.5 * cm, "Relatório de Auditoria de Segurança — EEB Professor Benonívio João Martins")
        self.drawRightString(A4[0] - 2 * cm, 28.5 * cm, "Next.js 14 • Supabase • TypeScript")
        self.setStrokeColor(colors.HexColor('#CBD5E1'))
        self.setLineWidth(0.5)
        self.line(2 * cm, 28.3 * cm, A4[0] - 2 * cm, 28.3 * cm)

        # Rodapé Inferior
        self.line(2 * cm, 1.8 * cm, A4[0] - 2 * cm, 1.8 * cm)
        self.drawString(2 * cm, 1.4 * cm, "CONFIDENCIAL — AUDITORIA DE CÓDIGO FONTE (Docs as Code)")
        self.drawRightString(A4[0] - 2 * cm, 1.4 * cm, f"Página {self._pageNumber} de {total_pages}")
        self.restoreState()

# ==============================================================================
# 3. GERAÇÃO PRINCIPAL DO RELATÓRIO
# ==============================================================================
def build_pdf():
    chart1_path, chart2_path = generate_charts()

    doc = SimpleDocTemplate(
        PDF_PATH,
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2.2 * cm,
        bottomMargin=2.2 * cm
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        textColor=colors.HexColor(PALETTE['primary']),
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor(PALETTE['secondary']),
    )

    h1_style = ParagraphStyle(
        'SecH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor(PALETTE['primary']),
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SecH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor(PALETTE['dark']),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'SecBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor(PALETTE['text']),
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'SecBullet',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'SecCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=6.5,
        leading=8.5,
        textColor=colors.HexColor('#0F172A'),
        backColor=colors.HexColor('#F1F5F9'),
        borderColor=colors.HexColor('#CBD5E1'),
        borderWidth=0.5,
        borderPadding=3,
        spaceBefore=2,
        spaceAfter=4
    )

    issue_body_style = ParagraphStyle(
        'IssueBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=colors.HexColor(PALETTE['text']),
        spaceAfter=3
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=1
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.2,
        leading=9.5,
        textColor=colors.HexColor('#1E293B')
    )

    chip_critica = ParagraphStyle('ChipC', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7, leading=9, textColor=colors.HexColor(PALETTE['critica']), alignment=1)
    chip_alta = ParagraphStyle('ChipA', parent=chip_critica, textColor=colors.HexColor(PALETTE['alta']))
    chip_media = ParagraphStyle('ChipM', parent=chip_critica, textColor=colors.HexColor(PALETTE['media']))
    chip_baixa = ParagraphStyle('ChipB', parent=chip_critica, textColor=colors.HexColor(PALETTE['baixa']))

    story = []

    # ==========================================================================
    # PÁGINA 1: CAPA & NOTA METODOLÓGICA
    # ==========================================================================
    story.append(Spacer(1, 1.0 * cm))
    story.append(Paragraph("RELATÓRIO DE AUDITORIA DE SEGURANÇA", subtitle_style))
    story.append(Spacer(1, 0.2 * cm))
    story.append(Paragraph("Portal Institucional EEB Professor Benonívio João Martins", title_style))
    story.append(Spacer(1, 0.3 * cm))
    story.append(HRFlowable(width="100%", thickness=2.5, color=colors.HexColor(PALETTE['secondary']), spaceBefore=4, spaceAfter=14))

    meta_info = [
        [Paragraph("<b>Data da Auditoria:</b>", body_style), Paragraph("10 de Outubro de 2026", body_style)],
        [Paragraph("<b>Ambiente &amp; Versão:</b>", body_style), Paragraph("Produção / v0.1.0 (Next.js 14.2.35, Supabase, Vercel)", body_style)],
        [Paragraph("<b>Responsável Técnico:</b>", body_style), Paragraph("Agente Especialista de Segurança (007 Hardening &amp; SAST)", body_style)],
        [Paragraph("<b>Status do Veredito:</b>", body_style), Paragraph("<font color='#B91C1C'><b>REPROVADO COM RESSALVAS CRÍTICAS</b> (Correções obrigatórias antes da homologação final)</font>", body_style)],
    ]
    meta_table = Table(meta_info, colWidths=[4.2 * cm, 12.8 * cm])
    meta_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(meta_table)

    story.append(Spacer(1, 0.8 * cm))
    story.append(Paragraph("Nota Metodológica &amp; Mapeamento de Stack", h2_style))
    story.append(Paragraph(
        "A auditoria cobriu 100% da base de código do portal escolar, abrangendo componentes de interface, "
        "Server Actions, rotas protegidas por middleware, esquemas relacionais no PostgreSQL e políticas de controle de acesso (Row Level Security - RLS). "
        "A análise adaptou estritamente as cinco categorias fundamentais para o ecossistema tecnológico detectado no projeto:",
        body_style
    ))

    stack_boxes = [
        [
            Paragraph("<b>Stack Detectada</b>", body_style),
            Paragraph(
                "• <b>Linguagem:</b> TypeScript 5.x / Node.js 20+<br/>"
                "• <b>Framework:</b> Next.js 14 (App Router, Server Actions, Server Components)<br/>"
                "• <b>Banco de Dados &amp; ORM:</b> Supabase (PostgreSQL 17 gerenciado, RLS ativo)<br/>"
                "• <b>Autenticação:</b> Supabase Auth (JWT assinado via HMAC, cookies HttpOnly)<br/>"
                "• <b>Frontend:</b> React 18, Tailwind CSS, Lucide React<br/>"
                "• <b>Infra/Deploy:</b> Vercel Cloud (Git-driven). <i>Docker, Helm e Terraform ausentes.</i>",
                body_style
            )
        ],
        [
            Paragraph("<b>Mapeamento das 5 Categorias</b>", body_style),
            Paragraph(
                "1. <b>Banco sem Tranca:</b> Políticas RLS no Supabase PostgreSQL e filtros autoritativos de banco.<br/>"
                "2. <b>Permissão no Navegador:</b> Gates no Next.js (Middleware vs. checagens nas Server Actions).<br/>"
                "3. <b>IDOR:</b> Parâmetros de IDs em Server Actions manipulando tabelas sem validação de vínculo.<br/>"
                "4. <b>Chaves Expostas:</b> Validação em runtime vs. build time e higiene de segredos no git/bundle.<br/>"
                "5. <b>Inputs sem Tratamento:</b> Expressões regulares de sanitização, links de protocolo e CSP.",
                body_style
            )
        ]
    ]
    t_stack = Table(stack_boxes, colWidths=[4.2 * cm, 12.8 * cm])
    t_stack.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor(PALETTE['light_bg'])),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor(PALETTE['border'])),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor(PALETTE['border'])),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_stack)

    story.append(PageBreak())

    # ==========================================================================
    # PÁGINA 2: RESUMO EXECUTIVO & GRÁFICOS
    # ==========================================================================
    story.append(Paragraph("1. Resumo Executivo da Auditoria", h1_style))
    story.append(Paragraph(
        "Foram identificados <b>8 achados de segurança</b> relevantes, sendo <b>2 Críticos</b>, <b>3 Altos</b>, <b>2 Médios</b> e <b>1 Baixo</b>. "
        "Adicionalmente, <b>6 mecanismos defensivos robustos</b> foram verificados e atestados como implementados de forma exemplar.",
        body_style
    ))
    story.append(Spacer(1, 0.2 * cm))

    chart_table_data = [
        [
            Image(chart1_path, width=7.2 * cm, height=5.8 * cm),
            Image(chart2_path, width=9.8 * cm, height=5.8 * cm)
        ]
    ]
    t_charts = Table(chart_table_data, colWidths=[7.4 * cm, 9.6 * cm])
    t_charts.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_charts)

    story.append(Spacer(1, 0.4 * cm))

    metric_data = [
        [
            Paragraph("<b>CRÍTICA</b>", table_header),
            Paragraph("<b>ALTA</b>", table_header),
            Paragraph("<b>MÉDIA</b>", table_header),
            Paragraph("<b>BAIXA</b>", table_header),
            Paragraph("<b>PONTOS FORTES</b>", table_header)
        ],
        [
            Paragraph("<font size=13 color='#B91C1C'><b>2</b></font><br/>Ação Imediata", table_cell),
            Paragraph("<font size=13 color='#EA580C'><b>3</b></font><br/>Correção P1", table_cell),
            Paragraph("<font size=13 color='#D97706'><b>2</b></font><br/>Correção P2", table_cell),
            Paragraph("<font size=13 color='#2563EB'><b>1</b></font><br/>Melhoria P3", table_cell),
            Paragraph("<font size=13 color='#059669'><b>6</b></font><br/>Aprovados", table_cell)
        ]
    ]
    t_metrics = Table(metric_data, colWidths=[3.4 * cm, 3.4 * cm, 3.4 * cm, 3.4 * cm, 3.4 * cm])
    t_metrics.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor(PALETTE['critica'])),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor(PALETTE['alta'])),
        ('BACKGROUND', (2,0), (2,0), colors.HexColor(PALETTE['media'])),
        ('BACKGROUND', (3,0), (3,0), colors.HexColor(PALETTE['baixa'])),
        ('BACKGROUND', (4,0), (4,0), colors.HexColor(PALETTE['forte'])),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor(PALETTE['light_bg'])),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor(PALETTE['border'])),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor(PALETTE['border'])),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_metrics)

    story.append(Spacer(1, 0.4 * cm))
    story.append(Paragraph(
        "<b>Conclusão Geral:</b> A arquitetura possui fundamentos de segurança avançados (Data Minimization, Rate Limiting, CSP estrito e sanitização criptográfica de uploads), "
        "mas sofre com vulnerabilidades lógicas de controle de acesso (RLS permissivo no Supabase, ausência de checagens de autorização em Server Actions de consulta e vetor de Stored XSS por bypass de protocolo).",
        body_style
    ))

    story.append(PageBreak())

    # ==========================================================================
    # PÁGINA 3: PONTOS FORTES E RISCOS CENTRAIS
    # ==========================================================================
    story.append(Paragraph("2. Pontos Fortes e Riscos Centrais", h1_style))

    story.append(Paragraph("<b>[+] Pontos Fortes Atestados no Código Real:</b>", h2_style))
    fortes = [
        "<b>Ausência Absoluta de Injeção HTML Bruta:</b> Varredura em 100% dos componentes React (arquivos .tsx) comprovou ausência total de <code>dangerouslySetInnerHTML</code> e <code>innerHTML</code>. O React escapa nativamente todas as strings de texto.",
        "<b>Parser Seguro de Hiperlinks:</b> O componente <code>FormattedText</code> (<code>components/ui/formatted-text.tsx</code>) valida estritamente URLs iniciando por <code>http://</code>, <code>https://</code> ou <code>www.</code>, eliminando execução de esquemas arbitrários em corpos de aviso.",
        "<b>Defesa Criptográfica contra Path Traversal:</b> Em <code>upload.ts</code> e <code>storage-security.ts</code>, nomes de arquivos são gerados compulsoriamente via <code>crypto.randomUUID()</code> e pastas higienizadas por regex, impossibilitando Directory Traversal.",
        "<b>Sliding-Window Rate Limiting em Camadas:</b> O módulo <code>lib/rate-limit.ts</code> impõe teto de 5 requisições/minuto no login (Edge Middleware e Server Action), com proteção anti-enumeração de contas (respostas de erro uniformes).",
        "<b>Sessões Seguras e Revogação Global:</b> O logout em <code>login/actions.ts</code> invoca <code>supabase.auth.signOut({ scope: 'global' })</code>, invalidando tokens em todos os dispositivos, e os cookies utilizam flags <code>HttpOnly</code> e <code>Secure</code>.",
        "<b>Higiene de Repositório e Git History Limpo:</b> Inspeção em todo o histórico de commits e no arquivo <code>.gitignore</code> confirmou inexistência de tokens privados ou arquivos <code>.env</code> commitados."
    ]
    for pf in fortes:
        story.append(Paragraph(f"• {pf}", bullet_style))

    story.append(Spacer(1, 0.4 * cm))
    story.append(Paragraph("<b>[!] Riscos Centrais Identificados:</b>", h2_style))
    fracos = [
        "<b>Vazamento de Dados por RLS Aberto:</b> Políticas com <code>FOR SELECT USING (true)</code> sobrepõem cláusulas restritivas no PostgreSQL, permitindo que usuários anônimos baixem avisos confidenciais, rascunhos e registros na lixeira via PostgREST direto.",
        "<b>Bypass de Interface em Server Actions de Leitura:</b> 7 Server Actions administrativas não validam autenticação no servidor. Qualquer cliente pode invocá-las via POST com o cabeçalho <code>Next-Action</code> a partir de rotas públicas sem fazer login.",
        "<b>Vetor de Stored XSS por Regex Não-Recursivo:</b> <code>lib/sanitize.ts</code> remove <code>javascript:</code> apenas uma vez. Strings como <code>javajavascript:script:alert(1)</code> burlam a validação Zod e o filtro, sendo salvas no banco e executadas em links de turmas.",
        "<b>Ausência de RBAC:</b> Nenhuma Server Action checa se o usuário é Administrador; qualquer conta autenticada comum obtém poderes totais de mutação e deleção.",
        "<b>Validação de Segredos Apenas em Runtime:</b> <code>lib/env-guard.ts</code> não valida variáveis em tempo de build, permitindo que chaves prefixadas acidentalmente com <code>NEXT_PUBLIC_</code> vazem para o bundle estático do cliente."
    ]
    for pf in fracos:
        story.append(Paragraph(f"• {pf}", bullet_style))

    story.append(PageBreak())

    # ==========================================================================
    # PÁGINA 4: TABELA DETALHADA DE ACHADOS POR CATEGORIA
    # ==========================================================================
    story.append(Paragraph("3. Tabela Detalhada de Achados por Categoria", h1_style))
    story.append(Paragraph(
        "A tabela a seguir apresenta arquivo por arquivo e linha por linha cada vulnerabilidade encontrada, sua criticidade e impacto prático.",
        body_style
    ))
    story.append(Spacer(1, 0.1 * cm))

    findings_data = [
        [
            Paragraph("<b>SEV.</b>", table_header),
            Paragraph("<b>CATEGORIA</b>", table_header),
            Paragraph("<b>ARQUIVO:LINHA</b>", table_header),
            Paragraph("<b>DESCRIÇÃO DA VULNERABILIDADE &amp; EXPLORABILIDADE</b>", table_header)
        ],
        # 1.1
        [
            Paragraph("<font color='#B91C1C'><b>CRÍTICA</b></font>", chip_critica),
            Paragraph("1. Banco sem Tranca", table_cell),
            Paragraph("<code>RLS_policies.sql:101-103</code><br/>(banco real)", table_cell),
            Paragraph("<b>RLS permissivo vazando rascunhos e lixeira:</b> A política <code>USING (true)</code> em <code>escola_avisos</code> combina com OR sobre a política de publicação, permitindo que visitantes anônimos leiam todos os avisos despublicados e na lixeira via API PostgREST.", table_cell)
        ],
        # 5.1
        [
            Paragraph("<font color='#B91C1C'><b>CRÍTICA</b></font>", chip_critica),
            Paragraph("5. Inputs / XSS", table_cell),
            Paragraph("<code>lib/sanitize.ts:18</code><br/><code>turmas/actions.ts:48</code><br/><code>turmas/[id]:93,174</code>", table_cell),
            Paragraph("<b>Stored XSS via bypass de protocolo javascript::</b> Remoção de padrão único em <code>replace(/javascript:/gi, '')</code> permite bypass com <code>javajavascript:script:</code>. O link malicioso é salvo e executado em <code>&lt;a href={link.url}&gt;</code>, agravado por CSP permissivo com <code>unsafe-inline</code>.", table_cell)
        ],
        # 2.1
        [
            Paragraph("<font color='#EA580C'><b>ALTA</b></font>", chip_alta),
            Paragraph("2. Permissão no Navegador", table_cell),
            Paragraph("<code>acervo/actions.ts:45</code><br/><code>avisos/actions.ts:50</code><br/><code>turmas/actions.ts:82</code><br/>+ 4 arquivos", table_cell),
            Paragraph("<b>7 Server Actions de leitura sem autenticação:</b> <code>getAvisosAdmin</code>, <code>getAcervoAdmin</code>, <code>getDocumentosAdmin</code>, etc., não invocam <code>auth.getUser()</code>. Qualquer usuário anônimo pode invocar o RPC direto via POST e extrair conteúdo confidencial.", table_cell)
        ],
        # 2.2
        [
            Paragraph("<font color='#EA580C'><b>ALTA</b></font>", chip_alta),
            Paragraph("2. Permissão no Navegador", table_cell),
            Paragraph("<code>dashboard/*/actions.ts</code><br/>(mutações)", table_cell),
            Paragraph("<b>Ausência de verificação RBAC (Role-Based Access):</b> Server Actions de escrita apenas testam se <code>user</code> existe, sem verificar se possui papel de <code>admin</code>. Qualquer conta autenticada tem poderes destrutivos totais.", table_cell)
        ],
        # 1.2
        [
            Paragraph("<font color='#EA580C'><b>ALTA</b></font>", chip_alta),
            Paragraph("1. Banco sem Tranca", table_cell),
            Paragraph("<code>RLS_policies.sql:83-96</code><br/>+ todas as tabelas", table_cell),
            Paragraph("<b>Inexistência de isolamento por proprietário:</b> Tabelas não possuem coluna <code>user_id</code>. RLS valida apenas <code>auth.uid() IS NOT NULL</code>, permitindo que qualquer usuário autenticado altere registros de outros.", table_cell)
        ],
        # 3.1
        [
            Paragraph("<font color='#D97706'><b>MÉDIA</b></font>", chip_media),
            Paragraph("3. IDOR", table_cell),
            Paragraph("<code>turmas/actions.ts:313, 345, 388</code>", table_cell),
            Paragraph("<b>IDOR em recados de turmas:</b> Ações como <code>deletePostPermanently</code> recebem <code>turma_id</code> mas filtram apenas por <code>id</code> do post, permitindo manipulação cruzada entre diferentes turmas.", table_cell)
        ],
        # 4.1
        [
            Paragraph("<font color='#D97706'><b>MÉDIA</b></font>", chip_media),
            Paragraph("4. Chaves Expostas", table_cell),
            Paragraph("<code>lib/env-guard.ts:6-24</code>", table_cell),
            Paragraph("<b>Guarda de segredos restrito a runtime:</b> <code>validateApiIsolation()</code> roda em tempo de execução. Variáveis <code>NEXT_PUBLIC_</code> vazam para o bundle JavaScript estático durante o <code>next build</code> antes de qualquer checagem de runtime.", table_cell)
        ],
        # 4.2
        [
            Paragraph("<font color='#2563EB'><b>BAIXA</b></font>", chip_baixa),
            Paragraph("4. Chaves Expostas", table_cell),
            Paragraph("<code>lib/data/*.ts:4-7</code><br/>(6 arquivos)", table_cell),
            Paragraph("<b>Instanciação de cliente Supabase sem fail-fast:</b> Criação global com operador <code>!</code> mascara ausência de variáveis de ambiente, causando crashes tardios sem validação na inicialização.", table_cell)
        ]
    ]

    t_findings = Table(findings_data, colWidths=[2.0 * cm, 3.4 * cm, 3.8 * cm, 7.8 * cm])
    t_findings.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor(PALETTE['primary'])),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor(PALETTE['border'])),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
    ]))
    story.append(t_findings)

    story.append(PageBreak())

    # ==========================================================================
    # PÁGINA 5: PLANO DE REMEDIAÇÃO PRIORIZADO
    # ==========================================================================
    story.append(Paragraph("4. Plano de Remediação Priorizado", h1_style))
    story.append(Paragraph(
        "As recomendações a seguir foram estruturadas em ordem de impacto e esforço de implementação para orientar os desenvolvedores:",
        body_style
    ))
    story.append(Spacer(1, 0.2 * cm))

    recs = [
        ("P1 (Imediata / Bloco de Produção)", [
            "<b>Corrigir RLS no Supabase PostgreSQL:</b> Dropar as políticas permissivas abertas com <code>USING (true)</code> em <code>escola_avisos</code>, <code>escola_acervo</code>, <code>escola_notificacoes</code> e <code>escola_turmas_posts</code>. Manter leitura pública restrita a <code>publicado = true AND status = 'ativo'</code>.",
            "<b>Sanitização Recursiva e Validação Estrita de Protocolo:</b> Substituir a lógica de <code>sanitizeString</code> em <code>lib/sanitize.ts</code> por whitelist de protocolos: URLs devem iniciar compulsoriamente por <code>http://</code> ou <code>https://</code>. Rejeitar terminantemente <code>javascript:</code> e <code>data:</code> via Zod regex."
        ]),
        ("P2 (Alta Prioridade / Próximo Deploy)", [
            "<b>Blindar Server Actions de Leitura:</b> Adicionar <code>const { data: { user } } = await supabase.auth.getUser(); if (!user) throw new Error('Não autorizado');</code> em <code>getAvisosAdmin</code>, <code>getAcervoAdmin</code>, <code>getDocumentosAdmin</code>, <code>getNotificacoesAdmin</code>, <code>getPaginasAdmin</code>, <code>getTurmasAdmin</code> e <code>getPostsAdmin</code>.",
            "<b>Implementar RBAC nas Server Actions:</b> Criar helper <code>assertAdmin()</code> que confere se <code>user.app_metadata?.role === 'admin'</code> antes de qualquer mutação de escrita ou deleção.",
            "<b>Corrigir Validação de Vínculo em Turmas (Anti-IDOR):</b> Em <code>moveToTrashPost</code>, <code>restorePost</code> e <code>deletePostPermanently</code>, adicionar cláusula <code>.eq('turma_id', validTurmaId.data)</code> na query de update/delete."
        ]),
        ("P3 (Média Prioridade / Hardening Contínuo)", [
            "<b>Validação Pré-Build em <code>next.config.mjs</code>:</b> Inserir <code>validateApiIsolation()</code> no próprio <code>next.config.mjs</code> para abortar o processo de build caso segredos sejam inseridos em <code>NEXT_PUBLIC_</code>.",
            "<b>Endurecimento de CSP:</b> Remover <code>'unsafe-inline'</code> e <code>'unsafe-eval'</code> de <code>script-src</code> em <code>next.config.mjs</code>, adotando nonces ou hashes para scripts estáticos."
        ])
    ]

    for p_level, items in recs:
        story.append(Paragraph(f"<b>{p_level}</b>", h2_style))
        for it in items:
            story.append(Paragraph(f"• {it}", bullet_style))
        story.append(Spacer(1, 0.2 * cm))

    story.append(PageBreak())

    # ==========================================================================
    # PÁGINAS 6+: ISSUES PARA O GITHUB (COMPLETAS & ISOLADAS)
    # ==========================================================================
    story.append(Paragraph("5. Issues para o GitHub (Prontas para Cópia)", h1_style))
    story.append(Paragraph(
        "Abaixo estão os textos completos formatados em Markdown para abertura direta de issues no GitHub, "
        "agrupados por escopo e contendo critérios de aceite verificáveis.",
        body_style
    ))
    story.append(Spacer(1, 0.1 * cm))

    issues = [
        {
            "id": "1",
            "title": "[Segurança] Vazamento de dados confidenciais e rascunhos por políticas RLS abertas (USING true)",
            "labels": "security, severidade:crítica, rls, database",
            "desc": "A política de leitura pública em `public.escola_avisos` e tabelas correlatas foi criada com `USING (true)`. No PostgreSQL RLS, políticas permissivas são unificadas via OR. Como resultado, qualquer usuário anônimo pode consultar diretamente a API PostgREST do Supabase (`/rest/v1/escola_avisos?select=*`) e visualizar avisos despublicados, rascunhos e itens na lixeira.",
            "evidence": "Arquivo: RLS_policies.sql:101-103\nCREATE POLICY \"Permitir leitura publica em avisos\"\nON public.escola_avisos FOR SELECT\nUSING (true);",
            "impact": "Exposição pública de informações administrativas restritas, avisos futuros antes da publicação e itens descartados.",
            "fix": "Dropar a política `Permitir leitura publica em avisos` e manter exclusivamente uma política condicionada: `USING (publicado = true AND status = 'ativo')`. Replicar o endurecimento para `escola_acervo`, `escola_notificacoes` e `escola_turmas_posts`.",
            "checklist": "- [ ] Dropar política permissiva aberta no PostgreSQL Supabase\n- [ ] Criar política de SELECT restrita a `publicado = true AND status = 'ativo'`\n- [ ] Testar requisição curl anônima verificando que registros na lixeira retornam vazios\n- [ ] Atualizar arquivo RLS_policies.sql no repositório"
        },
        {
            "id": "2",
            "title": "[Segurança] Vulnerabilidade de Stored XSS via esquema javascript: em links de turmas e recados",
            "labels": "security, severidade:crítica, xss, frontend",
            "desc": "O módulo `lib/sanitize.ts` utiliza regex não-recursivo `input.replace(/javascript:/gi, '')`. Uma carga como `javajavascript:script:alert(1)` burla a sanitização e passa na validação `z.string().url()`. O link é gravado no banco e renderizado diretamente em `<a href={link.url}>` na página pública de turmas (`app/(public)/turmas/[id]/page.tsx`). Agravado por CSP permissiva contendo `unsafe-inline`.",
            "evidence": "Arquivo: lib/sanitize.ts:18-19\n.replace(/javascript:/gi, '')\n\nArquivo: app/(public)/turmas/[id]/page.tsx:93\n<a href={link.url} target=\"_blank\" rel=\"noopener noreferrer\">",
            "impact": "Execução de código JavaScript arbitrário no navegador de visitantes, pais e estudantes ao clicar em links da turma.",
            "fix": "1. Modificar o schema Zod para rejeitar qualquer protocolo diferente de `http:` ou `https:`:\n`z.string().regex(/^https?:\\/\\//i, 'O link deve iniciar com http:// ou https://')`\n2. Remover `unsafe-inline` da Content-Security-Policy em `next.config.mjs`.",
            "checklist": "- [ ] Validar protocolo estrito `http://` e `https://` no Zod schema de links\n- [ ] Bloquear terminantemente esquemas `javascript:` e `data:`\n- [ ] Implementar helper de sanitização de URLs antes da renderização de href\n- [ ] Validar bloqueio contra payloads aninhados no teste unitário"
        },
        {
            "id": "3",
            "title": "[Segurança] Server Actions administrativas sem autenticação no servidor (Bypass de Middleware)",
            "labels": "security, severidade:alta, auth, server-actions",
            "desc": "Sete Server Actions de listagem administrativa (`getAvisosAdmin`, `getAcervoAdmin`, `getDocumentosAdmin`, `getNotificacoesAdmin`, `getPaginasAdmin`, `getTurmasAdmin` e `getPostsAdmin`) não validam a sessão com `supabase.auth.getUser()`. Qualquer invasor pode disparar um POST direto com cabeçalho `Next-Action` a partir de páginas públicas sem passar pelo middleware.",
            "evidence": "Arquivo: app/(admin)/dashboard/avisos/actions.ts:50-58\nexport async function getAvisosAdmin() {\n  const supabase = createClient();\n  const { data, error } = await supabase.from('escola_avisos').select(...);",
            "impact": "Extração irrestrita de dados do painel de controle por agentes externos não autenticados.",
            "fix": "Inserir em todas as Server Actions de consulta administrativa:\n```ts\nconst supabase = createClient();\nconst { data: { user }, error } = await supabase.auth.getUser();\nif (error || !user) throw new Error('Não autorizado');\n```",
            "checklist": "- [ ] Adicionar `auth.getUser()` em `getAvisosAdmin`\n- [ ] Adicionar `auth.getUser()` em `getAcervoAdmin`\n- [ ] Adicionar `auth.getUser()` em `getDocumentosAdmin`\n- [ ] Adicionar `auth.getUser()` em `getNotificacoesAdmin`\n- [ ] Adicionar `auth.getUser()` em `getPaginasAdmin`\n- [ ] Adicionar `auth.getUser()` em `getTurmasAdmin` e `getPostsAdmin`\n- [ ] Verificar que chamadas anônimas via POST retornam erro de autorização"
        },
        {
            "id": "4",
            "title": "[Segurança] Falha de IDOR e inconsistência de escopo em posts de turmas",
            "labels": "security, severidade:média, idor, turmas",
            "desc": "As Server Actions de exclusão e restauração de posts de turmas (`deletePostPermanently`, `moveToTrashPost`, `restorePost`) recebem o ID da turma como parâmetro, mas executam a mutação filtrando unicamente pelo `id` do post, permitindo alterar ou apagar comunicados pertencentes a turmas diferentes.",
            "evidence": "Arquivo: app/(admin)/dashboard/turmas/actions.ts:388-392\nconst { error: deleteError } = await supabase\n  .from('escola_turmas_posts')\n  .delete()\n  .eq('id', validId.data);",
            "impact": "Possibilidade de corrupção ou exclusão de comunicados de turmas de terceiros através de IDs manipulados.",
            "fix": "Incluir na query a condição de vínculo hierárquico:\n`.eq('id', validId.data).eq('turma_id', validTurmaId.data)`",
            "checklist": "- [ ] Adicionar filtro `.eq('turma_id', validTurmaId.data)` em `moveToTrashPost`\n- [ ] Adicionar filtro `.eq('turma_id', validTurmaId.data)` em `restorePost`\n- [ ] Adicionar filtro `.eq('turma_id', validTurmaId.data)` em `deletePostPermanently`\n- [ ] Validar retorno de erro caso o post não pertença à turma especificada"
        },
        {
            "id": "5",
            "title": "[Segurança] Validação de isolamento de segredos em tempo de compilação (Build-Time Guard)",
            "labels": "security, severidade:média, env, build",
            "desc": "A rotina `validateApiIsolation()` em `lib/env-guard.ts` opera somente em tempo de execução. Como o Next.js embute variáveis com prefixo `NEXT_PUBLIC_` estaticamente durante o comando `next build`, chaves confidenciais configuradas incorretamente vazam para o bundle JavaScript do navegador antes do runtime.",
            "evidence": "Arquivo: lib/env-guard.ts:6-24\nexport function validateApiIsolation(): void { ... }",
            "impact": "Exposição permanente de chaves de API caso ocorra erro humano na parametrização de variáveis na Vercel.",
            "fix": "Invocar `validateApiIsolation()` no topo de `next.config.mjs` para interromper o build com código de erro caso qualquer segredo seja detectado em variáveis com prefixo público.",
            "checklist": "- [ ] Importar ou reproduzir `validateApiIsolation()` em `next.config.mjs`\n- [ ] Testar falha de build forçando variável inválida `NEXT_PUBLIC_TEST_KEY=AIzaSy...`\n- [ ] Garantir que o pipeline da Vercel aborte antes de gerar artefatos estáticos"
        }
    ]

    for iss in issues:
        issue_elements = []
        safe_desc = html.escape(iss['desc']).replace('\n', '<br/>')
        safe_impact = html.escape(iss['impact']).replace('\n', '<br/>')
        safe_fix = html.escape(iss['fix']).replace('\n', '<br/>')
        safe_checklist = html.escape(iss['checklist']).replace('\n', '<br/>')
        safe_evidence = html.escape(iss['evidence']).replace('\n', '<br/>')

        iss_header = (
            f"<b>--- ISSUE {iss['id']} ---</b><br/>"
            f"<b>Título:</b> {html.escape(iss['title'])}<br/>"
            f"<b>Labels Sugeridas:</b> <code>{html.escape(iss['labels'])}</code><br/>"
            f"<b>Descrição do Problema &amp; Por Que é Explorável:</b><br/>{safe_desc}<br/>"
            f"<b>Evidência Técnica (Arquivo:Linha):</b>"
        )
        issue_elements.append(Paragraph(iss_header, issue_body_style))
        issue_elements.append(Paragraph(safe_evidence, code_style))

        iss_body = (
            f"<b>Impacto:</b> {safe_impact}<br/>"
            f"<b>Sugestão de Correção:</b><br/>{safe_fix}<br/>"
            f"<b>Critérios de Aceite (Checklist Verificável):</b><br/>{safe_checklist}<br/>"
            f"<b>--- FIM ISSUE {iss['id']} ---</b>"
        )
        issue_elements.append(Paragraph(iss_body, issue_body_style))
        issue_elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor(PALETTE['border']), spaceBefore=3, spaceAfter=8))

        # Mantém cada issue íntegra usando KeepTogether
        story.append(KeepTogether(issue_elements))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCESSO] Relatório PDF gerado com sucesso em: {PDF_PATH}")

if __name__ == "__main__":
    build_pdf()
