import { Output } from '@bitspace/circuit';
import { abs } from '@thi.ng/shader-ast';
import { map } from 'rxjs';

import { PrimSchema } from '../../../schemas/Prim/Prim';
import { InputPrimNode } from '../../internal/InputPrimNode/InputPrimNode';

export class Absolute extends InputPrimNode {
    static displayName = 'Absolute';

    outputs = {
        output: new Output({
            name: 'Output',
            type: PrimSchema(),
            observable: this.inputs.input.pipe(map(abs))
        })
    };
}
