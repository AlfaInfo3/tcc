export default function Loading() {
  return (
    <div className="flex h-64 w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-sm font-medium text-muted-foreground">Carregando…</p>
      </div>
    </div>
  );
}
