

interface Props {
  title: string,
}

export const Header = ({title}: Props) => {
  return (
    <header className="flex items-center justify-center p-4 sticky top-0 z-[1] bg-white/80 backdrop-blur-[8px]">
      {title}
    </header>
  );
}
