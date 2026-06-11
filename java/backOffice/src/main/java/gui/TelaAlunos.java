package gui;

import javax.swing.*;
import java.awt.*;
import java.io.IOException;
import java.util.List;

public class TelaAlunos extends JFrame {

    private final AlunoService service = new AlunoService();
    private List<Aluno> alunos;

    public TelaAlunos() {
        super("Gestão de Alunos - UniALFA", 800, 500);
    }

    @Override
    protected String labelBusca() {
        return "Buscar por nome:";
    }

    @Override
    protected String[] colunas() {
        return new String[]{"ID", "Nome", "RA", "Email", "Curso", "Apto"};
    }

    @Override
    protected void configurarColunas() {
        tabela.getColumnModel().getColumn(0).setPreferredWidth(40);
        tabela.getColumnModel().getColumn(5).setPreferredWidth(50);
    }

    @Override
    protected void carregarDados() {
        alunos = service.listar();
        preencherTabela(alunos);
    }

    @Override
    protected void buscar(String termo) {
        if (termo.isBlank()) { carregarDados(); return; }
        List<Aluno> filtrados = alunos.stream()
                .filter(a -> a.getNome().toLowerCase().contains(termo))
                .toList();
        preencherTabela(filtrados);
    }

    @Override
    protected JPanel montarRodape() {
        JButton btnNovo     = new JButton("Novo Aluno");
        JButton btnEditar   = new JButton("Editar");
        JButton btnExcluir  = new JButton("Excluir");
        JButton btnApto     = new JButton("Alternar Aptidão");
        JButton btnImportar = new JButton("Importar .txt");

        btnNovo.addActionListener(e -> abrirFormulario(null));
        btnEditar.addActionListener(e -> {
            Aluno selecionado = getAluno();
            if (selecionado != null) abrirFormulario(selecionado);
        });
        btnExcluir.addActionListener(e -> excluir());
        btnApto.addActionListener(e -> alternarAptidao());
        btnImportar.addActionListener(e -> importarTxt());

        JPanel rodape = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 8));
        rodape.add(btnNovo);
        rodape.add(btnEditar);
        rodape.add(btnExcluir);
        rodape.add(btnApto);
        rodape.add(btnImportar);
        return rodape;
    }

    private void preencherTabela(List<Aluno> lista) {
        modelo.setRowCount(0);
        for (Aluno a : lista) {
            modelo.addRow(new Object[]{
                    a.getId(), a.getNome(), a.getRa(),
                    a.getEmail(), a.getCurso(),
                    a.isApto() ? "✔ Sim" : "✘ Não"
            });
        }
    }

    private Aluno getAluno() {
        int id = getIdSelecionado("um aluno");
        if (id == -1) return null;
        return alunos.stream().filter(a -> a.getId() == id).findFirst().orElse(null);
    }

    private void abrirFormulario(Aluno aluno) {
        boolean editando = aluno != null;
        JTextField txtNome  = new JTextField(editando ? aluno.getNome()  : "", 20);
        JTextField txtRa    = new JTextField(editando ? aluno.getRa()    : "", 20);
        JTextField txtEmail = new JTextField(editando ? aluno.getEmail() : "", 20);
        JTextField txtCurso = new JTextField(editando ? aluno.getCurso() : "", 20);

        JPanel form = new JPanel(new GridLayout(4, 2, 6, 6));
        form.add(new JLabel("Nome *:")); form.add(txtNome);
        form.add(new JLabel("RA *:"));  form.add(txtRa);
        form.add(new JLabel("Email:")); form.add(txtEmail);
        form.add(new JLabel("Curso:")); form.add(txtCurso);

        int res = JOptionPane.showConfirmDialog(this, form,
                editando ? "Editar Aluno" : "Novo Aluno", JOptionPane.OK_CANCEL_OPTION);

        if (res == JOptionPane.OK_OPTION) {
            try {
                Aluno a = editando ? aluno : new Aluno();
                a.setNome(txtNome.getText().trim());
                a.setRa(txtRa.getText().trim());
                a.setEmail(txtEmail.getText().trim());
                a.setCurso(txtCurso.getText().trim());
                if (!editando) a.setApto(true);

                if (editando) service.editar(a);
                else          service.cadastrar(a);

                carregarDados();
                JOptionPane.showMessageDialog(this, editando ? "Aluno atualizado!" : "Aluno cadastrado!");
            } catch (IllegalArgumentException ex) {
                JOptionPane.showMessageDialog(this, ex.getMessage(), "Dados inválidos", JOptionPane.WARNING_MESSAGE);
            }
        }
    }

    private void excluir() {
        Aluno a = getAluno();
        if (a == null) return;
        int confirm = JOptionPane.showConfirmDialog(this,
                "Excluir o aluno \"" + a.getNome() + "\"?",
                "Confirmar", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            service.excluir(a.getId());
            carregarDados();
        }
    }

    private void alternarAptidao() {
        Aluno a = getAluno();
        if (a == null) return;
        a.setApto(!a.isApto());
        service.editar(a);
        carregarDados();
        JOptionPane.showMessageDialog(this,
                "Aluno marcado como " + (a.isApto() ? "APTO" : "INAPTO") + ".");
    }

    private void importarTxt() {
        JFileChooser chooser = new JFileChooser();
        if (chooser.showOpenDialog(this) == JFileChooser.APPROVE_OPTION) {
            try {
                int qtd = service.importarDeTxt(chooser.getSelectedFile().getAbsolutePath());
                carregarDados();
                JOptionPane.showMessageDialog(this, qtd + " aluno(s) importado(s)!");
            } catch (IOException ex) {
                JOptionPane.showMessageDialog(this, "Erro: " + ex.getMessage(), "Erro", JOptionPane.ERROR_MESSAGE);
            }
        }
    }
}
