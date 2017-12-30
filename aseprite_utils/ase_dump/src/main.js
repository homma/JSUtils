/*
 * @author Daisuke Homma
 */

{ // namespace boundary

const check_args = () => {

  n_args = process.argv.length;
  if(n_args != 3) {

    console.log("Usage: node myapp.js <FILE>");
    process.exit();

  }
}

const get_file_path = () => {

  return process.argv[2];

}

const main = () => {

  check_args();
  const buf = get_file_path();

  const ase = new myapp.Ase(buf);
  ase.dump();

}

main();

} // namespace boundary
