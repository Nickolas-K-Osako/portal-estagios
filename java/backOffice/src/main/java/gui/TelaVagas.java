package gui;

import backOffice.src.main.java.gui.TelaBase;

import javax.swing.*;

public class TelaVagas extends TelaBase {

    private final VagaService service = new VagaService();
    private List<Vaga> vagas;

    public TelaVagas() {
        super("Gestão de Vagas - UniALFA", 950, 500);
    }

    @Override
    protected String labelBusca() {
        return "Buscar por título:";
    }

    @Override
    protected String[] colunas() {
        return new String[]{"ID", "Empresa", "Título", "Área", "Modalidade", "Carga H.", "Status"};
    }

    @Override
    protected void configurarColunas() {
        tabela.getColumnModel().getColumn(0).setPreferredWidth(40);
        tabela.getColumnModel().getColumn(2).setPreferredWidth(180);
        tabela.getColumnModel().getColumn(4).setPreferredWidth(80);
        tabela.getColumnModel().getColumn(5).setPreferredWidth(70);
        tabela.getColumnModel().getColumn(6).setPreferredWidth(80);
    }

    @Override
    protected void carregarDados() {
        vagas = service.listar();
        preencherTabela(vagas);
    }

    @Override
    protected void buscar(String termo) {
        if (termo.isBlank()) { carregarDados(); return; }
        List<Vaga> filtradas = vagas.stream()
                .filter(v -> v.getTitulo().toLowerCase().contains(termo))
                .toList();
        preencherTabela(filtradas);
    }

    @Override
    protected JPanel montarRodape() {
        JButton btnNova    = new JButton("Nova Vaga");
        JButton btnEditar  = new JButton("Editar");
        JButton btnExcluir = new JButton("Excluir");
        JButton btnStatus  = new JButton("Alternar Status");

        btnNova.addActionListener(e -> abrirFormulario(null));
        btnEditar.addActionListener(e -> {
            Vaga selecionada = getVaga();
            if (selecionada != null) abrirFormulario(selecionada);
        });
        btnExcluir.addActionListener(e -> excluir());
        btnStatus.addActionListener(e -> alternarStatus());

        JPanel rodape = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 8));
        rodape.add(btnNova);
        rodape.add(btnEditar);
        rodape.add(btnExcluir);
        rodape.add(btnStatus);
        return rodape;
    }

    // ── métodos específicos de Vaga ───────────────────────────────────

    private void preencherTabela(List<Vaga> lista) {
        modelo.setRowCount(0);
        for (Vaga v : lista) {
            modelo.addRow(new Object[]{
                    v.getId(), v.getEmpresaNome(), v.getTitulo(),
                    v.getArea(), v.getModalidade(),
                    v.getCargaHoraria(), v.getStatus()
            });
        }
    }

    private Vaga getVaga() {
        int id = getIdSelecionado("uma vaga");
        if (id == -1) return null;
        return vagas.stream().filter(v -> v.getId() == id).findFirst().orElse(null);
    }

    private void abrirFormulario(Vaga vaga) {
        boolean editando = vaga != null;

        JTextField txtEmpresaId  = new JTextField(editando ? String.valueOf(vaga.getEmpresaId()) : "", 20);
        JTextField txtTitulo     = new JTextField(editando ? vaga.getTitulo()       : "", 20);
        JTextField txtArea       = new JTextField(editando ? vaga.getArea()         : "", 20);
        JTextField txtRequisitos = new JTextField(editando ? vaga.getRequisitos()   : "", 20);
        JTextField txtCargaH     = new JTextField(editando ? String.valueOf(vaga.getCargaHoraria()) : "", 20);
        JTextArea  txtDescricao  = new JTextArea(editando  ? vaga.getDescricao()    : "", 3, 20);
        txtDescricao.setLineWrap(true);
        txtDescricao.setWrapStyleWord(true);

        String[] modalidades = {"Presencial", "Remoto", "Híbrido"};
        JComboBox<String> cmbModalidade = new JComboBox<>(modalidades);
        if (editando) cmbModalidade.setSelectedItem(vaga.getModalidade());

        JPanel form = new JPanel(new GridLayout(7, 2, 6, 6));
        form.add(new JLabel("ID da Empresa *:")); form.add(txtEmpresaId);
        form.add(new JLabel("Título *:"));        form.add(txtTitulo);
        form.add(new JLabel("Área *:"));          form.add(txtArea);
        form.add(new JLabel("Requisitos:"));      form.add(txtRequisitos);
        form.add(new JLabel("Carga Horária:"));   form.add(txtCargaH);
        form.add(new JLabel("Modalidade:"));      form.add(cmbModalidade);
        form.add(new JLabel("Descrição:"));       form.add(new JScrollPane(txtDescricao));

        int res = JOptionPane.showConfirmDialog(this, form,
                editando ? "Editar Vaga" : "Nova Vaga",
                JOptionPane.OK_CANCEL_OPTION);

        if (res == JOptionPane.OK_OPTION) {
            try {
                Vaga v = editando ? vaga : new Vaga();
                v.setEmpresaId(Integer.parseInt(txtEmpresaId.getText().trim()));
                v.setTitulo(txtTitulo.getText().trim());
                v.setArea(txtArea.getText().trim());
                v.setRequisitos(txtRequisitos.getText().trim());
                v.setCargaHoraria(Float.parseFloat(txtCargaH.getText().trim()));
                v.setModalidade((String) cmbModalidade.getSelectedItem());
                v.setDescricao(txtDescricao.getText().trim());
                if (!editando) v.setStatus("Aberta");

                if (editando) service.editar(v);
                else          service.cadastrar(v);

                carregarDados();
                JOptionPane.showMessageDialog(this, editando ? "Vaga atualizada!" : "Vaga cadastrada!");
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(this, "ID da empresa e carga horária devem ser números.",
                        "Dados inválidos", JOptionPane.WARNING_MESSAGE);
            } catch (IllegalArgumentException ex) {
                JOptionPane.showMessageDialog(this, ex.getMessage(),
                        "Dados inválidos", JOptionPane.WARNING_MESSAGE);
            }
        }
    }

    private void excluir() {
        Vaga v = getVaga();
        if (v == null) return;
        int confirm = JOptionPane.showConfirmDialog(this,
                "Excluir a vaga \"" + v.getTitulo() + "\"?",
                "Confirmar", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            service.excluir(v.getId());
            carregarDados();
        }
    }

    private void alternarStatus() {
        Vaga v = getVaga();
        if (v == null) return;
        String novoStatus = v.getStatus().equals("Aberta") ? "Fechada" : "Aberta";
        v.setStatus(novoStatus);
        service.editar(v);
        carregarDados();
        JOptionPane.showMessageDialog(this, "Vaga marcada como " + novoStatus + ".");
    }
}
