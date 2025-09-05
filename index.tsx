export const getStaticProps = async () => {
  return {
    props: {
      data: {
        message: 'A página está funcionando!',
      },
    },
  }
}
