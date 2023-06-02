#pragma once

#include <utility>
#include "barretenberg/srs/reference_string/file_reference_string.hpp"
#include "barretenberg/honk/proof_system/prover.hpp"
#include "barretenberg/honk/proof_system/verifier.hpp"
#include "barretenberg/proof_system/circuit_constructors/standard_circuit_constructor.hpp"
#include "barretenberg/plonk/proof_system/verifier/verifier.hpp"
#include "barretenberg/proof_system/composer/composer_helper_lib.hpp"
#include "barretenberg/proof_system/composer/permutation_helper.hpp"

#include "barretenberg/honk/flavor/standard.hpp"

namespace proof_system::honk {
class StandardHonkComposerHelper {
  public:
    using Flavor = flavor::Standard;
    using PCSParams = Flavor::PCSParams;
    using CircuitConstructor = Flavor::CircuitConstructor;
    using ProvingKey = Flavor::ProvingKey;
    using VerificationKey = Flavor::VerificationKey;
    using PCSCommitmentKey = PCSParams::CommitmentKey;

    static constexpr size_t NUM_RESERVED_GATES = 2; // equal to the number of multilinear evaluations leaked
    static constexpr size_t NUM_WIRES = CircuitConstructor::NUM_WIRES;
    std::shared_ptr<ProvingKey> proving_key;
    std::shared_ptr<VerificationKey> verification_key;
    // The crs_factory holds the path to the srs and exposes methods to extract either the prover srs (collection of g1
    // points) or verifier srs ([x]_2)
    std::shared_ptr<ReferenceStringFactory> crs_factory_;
    // The commitment key is passed to the prover but also used herein to compute the verfication key commitments
    std::shared_ptr<PCSCommitmentKey> commitment_key;
    bool computed_witness = false;
    // TODO(Luke): use make_shared
    StandardHonkComposerHelper()
        : StandardHonkComposerHelper(std::shared_ptr<ReferenceStringFactory>(
              new proof_system::FileReferenceStringFactory("../srs_db/ignition")))
    {}
    StandardHonkComposerHelper(std::shared_ptr<ReferenceStringFactory> crs_factory)
        : crs_factory_(std::move(crs_factory))
    {}

    StandardHonkComposerHelper(std::unique_ptr<ReferenceStringFactory>&& crs_factory)
        : crs_factory_(std::move(crs_factory))
    {}
    StandardHonkComposerHelper(std::shared_ptr<ProvingKey> p_key, std::shared_ptr<VerificationKey> v_key)
        : proving_key(std::move(p_key))
        , verification_key(std::move(v_key))
    {}
    StandardHonkComposerHelper(StandardHonkComposerHelper&& other) noexcept = default;
    StandardHonkComposerHelper(const StandardHonkComposerHelper& other) = delete;
    StandardHonkComposerHelper& operator=(StandardHonkComposerHelper&& other) noexcept = default;
    StandardHonkComposerHelper& operator=(const StandardHonkComposerHelper& other) = delete;
    ~StandardHonkComposerHelper() = default;

    std::shared_ptr<ProvingKey> compute_proving_key(const CircuitConstructor& circuit_constructor);
    std::shared_ptr<VerificationKey> compute_verification_key(const CircuitConstructor& circuit_constructor);

    StandardVerifier create_verifier(const CircuitConstructor& circuit_constructor);

    StandardProver create_prover(const CircuitConstructor& circuit_constructor);

    // TODO(#216)(Adrian): Seems error prone to provide the number of randomized gates
    std::shared_ptr<ProvingKey> compute_proving_key_base(const CircuitConstructor& circuit_constructor,
                                                         const size_t minimum_circuit_size = 0,
                                                         const size_t num_randomized_gates = NUM_RESERVED_GATES);

    void compute_witness(const CircuitConstructor& circuit_constructor, const size_t minimum_circuit_size = 0);
};

} // namespace proof_system::honk
