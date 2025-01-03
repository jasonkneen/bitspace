import { Output } from '@bitspace/circuit';
import { fract } from '@thi.ng/shader-ast';
import { map } from 'rxjs';

import { PrimSchema } from '../../../schemas/Prim/Prim';
import { InputPrimNode } from '../../internal/InputPrimNode/InputPrimNode';

export class Fractional extends InputPrimNode {
    static displayName = 'Fractional';

    outputs = {
        output: new Output({
            name: 'Output',
            type: PrimSchema(),
            observable: this.inputs.input.pipe(map(fract))
        })
    };
}
