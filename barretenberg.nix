{ llvmPackages, cmake, lib, callPackage, binaryen }:
let
  stdenv = llvmPackages.stdenv;
  optionals = lib.lists.optionals;
  targetPlatform = stdenv.targetPlatform;
  toolchain_file = ./cpp/cmake/toolchains/${targetPlatform.system}.cmake;
in
stdenv.mkDerivation
{
  pname = "libbarretenberg";
  version = "0.1.0";

  src = ./cpp;

  nativeBuildInputs = [ cmake ]
    ++ optionals targetPlatform.isWasm [ binaryen ];

  buildInputs = [ ]
    ++ optionals (targetPlatform.isDarwin || targetPlatform.isLinux) [
    llvmPackages.openmp
  ];

  cmakeFlags = [
    "-DTESTING=OFF"
    "-DBENCHMARKS=OFF"
    "-DCMAKE_TOOLCHAIN_FILE=${toolchain_file}"
  ]
  ++ optionals (targetPlatform.isDarwin || targetPlatform.isLinux)
    [ "-DCMAKE_BUILD_TYPE=RelWithAssert" ];

  NIX_CFLAGS_COMPILE =
    optionals targetPlatform.isDarwin [ " -fno-aligned-allocation" ];

  enableParallelBuilding = true;
}
