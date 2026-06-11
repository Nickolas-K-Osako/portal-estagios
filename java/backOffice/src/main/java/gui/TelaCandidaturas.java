package gui;

import javax. swing.*;
import java.awt.*;
import java.util.List;

public class TelaCandidaturas extends TelaBase {

    private final CandidaturaService service = new CandidaturaService();
    private List<Candidatura> candidaturas;

    public TelaCandidaturas() {
        super("Gestão de Candidaturas - UniALFA", 900, 500);
    }

    @Override
    protected String labelBusca() {
        return "Buscar por aluno:";
    }

    @Override
    protected String[] colunas() {
        return new String[]{"ID", "Aluno", "Vaga", "Status", "Observação", "Data", "Atualizado"};
    }

    @Override
    protected void configurarColunas() {
        tabela.getColumnModel().getColumn(0).setPreferredWidth(40);
        tabela.getColumnModel().getColumn(3).setPreferredWidth(80);
        tabela.getColumnModel().getColumn(5).setPreferredWidth(90);
        tabela.getColumnModel().getColumn(6).setPreferredWidth(90);
    }

    @Override
    protected void carregarDados() {
        candidaturas = service.listar();
        preencherTabela(candidaturas);
    }

    @Override
    protected void buscar(String termo) {
        if (termo.isBlank()) { carregarDados(); return; }
        List<Candidatura> filtradas = candidaturas.stream()
                .filter(c -> c.getAlunoNome().toLowerCase().contains(termo))
                .toList();
        preencherTabela(filtradas);
    }

    @Override
    protected JPanel montarRodape() {
        JButton btnNova    = new JButton("Nova Candidatura");
        JButton btnEditar  = new JButton("Editar");
        JButton btnExcluir = new JButton("Excluir");
        JButton btnStatus  = new JButton("Alterar Status");

        btnNova.addActionListener(e -> abrirFormulario(null));
        btnEditar.addActionListener(e -> {
            Candidatura selecionada = getCandidatura();
            if (selecionada != null) abrirFormulario(selecionada);
        });
        btnExcluir.addActionListener(e -> excluir());
        btnStatus.addActionListener(e -> alterarStatus());

        JPanel rodape = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 8));
        rodape.add(btnNova);
        rodape.add(btnEditar);
        rodape.add(btnExcluir);
        rodape.add(btnStatus);
        return rodape;
        System.out.println("testando git");
    }

    // ── métodos específicos de Candidatura ────────────────────────────

    private void preencherTabela(List<Candidatura> lista) {
        modelo.setRowCount(0);
        for (Candidatura c : lista) {
            modelo.addRow(new Object[]{
                    c.getId(),
                    c.getAlunoNome(),
                    c.getVagaTitulo(),
                    c.getStatus(),
                    c.getObservacao(),
                    c.getDataCandidatura(),
                    c.getUpdated()
            });
        }
    }

    private Candidatura getCandidatura() {
        int id = getIdSelecionado("uma candidatura");
        if (id == -1) return null;
        return candidaturas.stream().filter(c -> c.getId() == id).findFirst().orElse(null);
    }

    private void abrirFormulario(Candidatura candidatura) {
        boolean editando = candidatura != null;

        JTextField txtAlunoId = new JTextField(editando ? String.valueOf(candidatura.getAlunoId()) : "", 20);
        JTextField txtVagaId  = new JTextField(editando ? String.valueOf(candidatura.getVagaId())  : "", 20);
        JTextField txtObs     = new JTextField(editando ? candidatura.getObservacao() : "", 20);

        String[] statusOpcoes = {"Pendente", "Aprovado", "Reprovado", "Cancelado"};
        JComboBox<String> cmbStatus = new JComboBox<>(statusOpcoes);
        if (editando) cmbStatus.setSelectedItem(candidatura.getStatus());

        JPanel form = new JPanel(new GridLayout(4, 2, 6, 6));
        form.add(new JLabel("ID do Aluno *:")); form.add(txtAlunoId);
        form.add(new JLabel("ID da Vaga *:"));  form.add(txtVagaId);
        form.add(new JLabel("Status:"));        form.add(cmbStatus);
        form.add(new JLabel("Observação:"));    form.add(txtObs);

        int res = JOptionPane.showConfirmDialog(this, form,
                editando ? "Editar Candidatura" : "Nova Candidatura",
                JOptionPane.OK_CANCEL_OPTION);

        if (res == JOptionPane.OK_OPTION) {
            try {
                Candidatura c = editando ? candidatura : new Candidatura();
                c.setAlunoId(Integer.parseInt(txtAlunoId.getText().trim()));
                c.setVagaId(Integer.parseInt(txtVagaId.getText().trim()));
                c.setStatus((String) cmbStatus.getSelectedItem());
                c.setObservacao(txtObs.getText().trim());

                if (editando) service.editar(c);
                else          service.cadastrar(c);

                carregarDados();
                JOptionPane.showMessageDialog(this, editando ? "Candidatura atualizada!" : "Candidatura cadastrada!");
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(this, "ID do aluno e da vaga devem ser números.",
                        "Dados inválidos", JOptionPane.WARNING_MESSAGE);
            } catch (IllegalArgumentException ex) {
                JOptionPane.showMessageDialog(this, ex.getMessage(),
                        "Dados inválidos", JOptionPane.WARNING_MESSAGE);
            }
        }
    }

    private void excluir() {
        Candidatura c = getCandidatura();
        if (c == null) return;
        int confirm = JOptionPane.showConfirmDialog(this,
                "Excluir a candidatura de \"" + c.getAlunoNome() + "\"?",
                "Confirmar", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            service.excluir(c.getId());
            carregarDados();
        }
    }

    private void alterarStatus() {
        Candidatura c = getCandidatura();
        if (c == null) return;

        String[] opcoes = {"Pendente", "Aprovado", "Reprovado", "Cancelado"};
        String novoStatus = (String) JOptionPane.showInputDialog(
                this, "Selecione o novo status:",
                "Alterar Status", JOptionPane.PLAIN_MESSAGE,
                null, opcoes, c.getStatus());

        if (novoStatus != null) {
            c.setStatus(novoStatus);
            service.editar(c);
            carregarDados();
            JOptionPane.showMessageDialog(this, "Status atualizado para: " + novoStatus);
        }
    }
