export default interface ModalComponentProps {
  onCancel: () => void;
  onExec: (values: { value: string, same: boolean }[]) => void;
  files: FileList | null;
}