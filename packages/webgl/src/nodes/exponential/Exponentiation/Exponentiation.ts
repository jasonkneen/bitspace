import { Output } from '@bitspace/circuit';
import { exp } from '@thi.ng/shader-ast';
import { map } from 'rxjs';

import { PrimSchema } from '../../../schemas/Prim/Prim';
import { InputPrimNode } from '../../internal/InputPrimNode/InputPrimNode';

export class Exponentiation extends InputPrimNode {
    static displayName = 'Exponentiation';

    outputs = {
        output: new Output({
            name: 'Output',
            type: PrimSchema(),
            observable: this.inputs.input.pipe(map(exp))
        })
    };
}
